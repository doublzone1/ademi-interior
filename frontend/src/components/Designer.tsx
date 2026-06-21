import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Wand2, MessageSquarePlus, Dice5, BookmarkPlus, ChevronDown, Copy, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from './ImageUpload';
import { RoomSelector } from './RoomSelector';
import { StyleSelector } from './StyleSelector';
import { PaletteSelector } from './PaletteSelector';
import { AdvancedSettings, type AdvancedValues } from './AdvancedSettings';
import { VariantsControl } from './VariantsControl';
import { QuickPrompts } from './QuickPrompts';
import { ResultViewer } from './ResultViewer';
import { HistoryPanel } from './HistoryPanel';
import { PresetsPanel } from './PresetsPanel';
import { generateDesign, getProviderInfo, ApiError, type ProviderInfo } from '../lib/api';
import { buildFrontendPrompt } from '../lib/buildPrompt';
import { useI18n } from '../i18n/I18nProvider';
import { useHistory, type HistoryItem } from '../hooks/useHistory';
import { usePresets, type PresetItem } from '../hooks/usePresets';
import {
  ROOM_TYPES,
  STYLES,
  COLOR_PALETTES,
  LIGHTING_OPTIONS,
  CAMERA_OPTIONS,
  DENSITY_OPTIONS,
  QUICK_PROMPTS,
} from '../lib/constants';
import type { MessageKey } from '../i18n/messages';

const DEFAULT_ROOM = 'living_room';
const DEFAULT_STYLE = 'modern';
const DEFAULT_PALETTE = 'warm_neutrals';

const DEFAULT_ADVANCED: AdvancedValues = {
  lighting: 'natural_day',
  cameraAngle: 'wide',
  furnitureDensity: 'balanced',
  material: 'default',
  model: 'flux',
  aspectRatio: 'auto',
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickSome<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

export function Designer() {
  const { t } = useI18n();
  const history = useHistory();
  const presets = usePresets();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [roomType, setRoomType] = useState(DEFAULT_ROOM);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [advanced, setAdvanced] = useState<AdvancedValues>(DEFAULT_ADVANCED);
  const [customPrompt, setCustomPrompt] = useState('');
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [variants, setVariants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const retryAbortRef = useRef<AbortController | null>(null);

  // Show-prompt state
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  // Save-preset inline form state
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  const presetNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProviderInfo().then(setProviderInfo);
  }, []);

  // Abort any in-flight requests when the component unmounts
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      retryAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (savingPreset) {
      presetNameRef.current?.focus();
    }
  }, [savingPreset]);

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file);
    setImagePreview(preview);
    setResultUrls([]);
  };

  const toggleQuickPrompt = useCallback((p: string) => {
    setQuickPrompts((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }, []);

  const buildCombinedPrompt = useCallback(() => {
    const parts: string[] = [];
    if (customPrompt.trim()) parts.push(customPrompt.trim());
    if (quickPrompts.length) parts.push(quickPrompts.join(', '));
    return parts.join(', ');
  }, [customPrompt, quickPrompts]);

  // Prompt preview (mirrors backend buildPrompt)
  const currentPrompt = useMemo(() => {
    return buildFrontendPrompt({
      roomType,
      style,
      colorPalette: palette,
      ...advanced,
      customPrompt: buildCombinedPrompt() || undefined,
    });
  }, [roomType, style, palette, advanced, buildCombinedPrompt]);

  // --- Handlers ---

  const handleRandomize = useCallback(() => {
    const promptValues = Object.values(QUICK_PROMPTS);
    setRoomType(pick(ROOM_TYPES).id);
    setStyle(pick(STYLES).id);
    setPalette(pick(COLOR_PALETTES).id);
    setAdvanced({
      lighting: pick(LIGHTING_OPTIONS).id,
      cameraAngle: pick(CAMERA_OPTIONS).id,
      furnitureDensity: pick(DENSITY_OPTIONS).id,
      material: 'default',
      model: advanced.model,
      aspectRatio: advanced.aspectRatio,
    });
    setQuickPrompts(pickSome(promptValues, 0, 3));
    setCustomPrompt('');
    toast.success(t('random.toast'));
  }, [advanced.model, t]);

  const handleCopyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      setPromptCopied(true);
      toast.success(t('prompt.copied'));
      setTimeout(() => setPromptCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [currentPrompt, t]);

  const handleRetryOne = useCallback(async (index: number) => {
    if (regeneratingIndex !== null || loading) return;

    retryAbortRef.current?.abort();
    const ctrl = new AbortController();
    retryAbortRef.current = ctrl;

    setRegeneratingIndex(index);
    try {
      const params = {
        roomType,
        style,
        colorPalette: palette,
        customPrompt: buildCombinedPrompt() || undefined,
        ...advanced,
        variants: 1,
      };
      const res = await generateDesign(imageFile, params, ctrl.signal);
      const urls = res.imageUrls?.length ? res.imageUrls : res.imageUrl ? [res.imageUrl] : [];
      if (!urls.length) throw new Error('empty');

      setResultUrls((prev) => {
        const next = [...prev];
        next[index] = urls[0];
        return next;
      });
      toast.success(t('result.retried'));
    } catch (err) {
      if (ctrl.signal.aborted) return;
      const msg = err instanceof ApiError && err.message === 'timeout'
        ? t('errors.timeout')
        : t('errors.generic');
      toast.error(msg);
    } finally {
      setRegeneratingIndex(null);
    }
  }, [regeneratingIndex, loading, roomType, style, palette, advanced, imageFile, buildCombinedPrompt, t]);

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;
    presets.add({
      name: presetName.trim(),
      roomType,
      style,
      colorPalette: palette,
      advanced,
      quickPrompts,
      customPrompt,
    });
    toast.success(t('presets.saved'));
    setSavingPreset(false);
    setPresetName('');
  }, [presetName, presets, roomType, style, palette, advanced, quickPrompts, customPrompt, t]);

  const handleApplyPreset = useCallback((item: PresetItem) => {
    setRoomType(item.roomType);
    setStyle(item.style);
    setPalette(item.colorPalette);
    setAdvanced(item.advanced);
    setQuickPrompts(item.quickPrompts);
    setCustomPrompt(item.customPrompt);
    setResultUrls([]);
    document.getElementById('designer')?.scrollIntoView({ behavior: 'smooth' });
    toast.success(`${item.name} — ${t('presets.apply')}`);
  }, [t]);

  const handleSubmit = async () => {
    if (providerInfo?.imageRequired && !imageFile) {
      toast.error(t('errors.noImage'));
      return;
    }
    if (loading) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setResultUrls([]);
    const tId = toast.loading(t('result.loading'));

    try {
      const params = {
        roomType,
        style,
        colorPalette: palette,
        customPrompt: buildCombinedPrompt() || undefined,
        ...advanced,
        variants,
      };

      const res = await generateDesign(imageFile, params, ctrl.signal);
      const urls = res.imageUrls?.length ? res.imageUrls : res.imageUrl ? [res.imageUrl] : [];
      if (!urls.length) throw new Error('empty');

      setResultUrls(urls);
      void history.add({
        imageUrls: urls,
        params: {
          roomType, style, colorPalette: palette,
          customPrompt: buildCombinedPrompt() || undefined,
          ...advanced,
        },
        thumbnailDataUrl: urls[0],
      });

      toast.success(
        `${t('success.generated')} · ${((res.processingTime ?? 0) / 1000).toFixed(1)}s`,
        { id: tId }
      );
    } catch (err) {
      if (ctrl.signal.aborted) {
        toast.dismiss(tId);
        return;
      }
      const code = err instanceof ApiError ? err.message : '';
      const known: Record<string, MessageKey> = {
        network: 'errors.network',
        serverBad: 'errors.serverBad',
        generic: 'errors.generic',
        empty: 'errors.serverBad',
        timeout: 'errors.timeout',
      };
      const msg =
        known[code]
          ? t(known[code])
          : err instanceof Error
          ? err.message
          : t('errors.generic');
      toast.error(msg, { id: tId });
    } finally {
      setLoading(false);
    }
  };

  const restoreFromHistory = (item: HistoryItem) => {
    setRoomType(item.params.roomType);
    setStyle(item.params.style);
    setPalette(item.params.colorPalette);
    setAdvanced({
      lighting: item.params.lighting ?? DEFAULT_ADVANCED.lighting,
      cameraAngle: item.params.cameraAngle ?? DEFAULT_ADVANCED.cameraAngle,
      furnitureDensity: item.params.furnitureDensity ?? DEFAULT_ADVANCED.furnitureDensity,
      material: item.params.material ?? DEFAULT_ADVANCED.material,
      model: item.params.model ?? DEFAULT_ADVANCED.model,
      aspectRatio: item.params.aspectRatio ?? DEFAULT_ADVANCED.aspectRatio,
    });
    setCustomPrompt(item.params.customPrompt ?? '');
    setResultUrls(item.imageUrls);
    setImagePreview(item.thumbnailDataUrl ?? null);
    document.getElementById('designer')?.scrollIntoView({ behavior: 'smooth' });
    toast.success(t('history.restore'));
  };

  const canSubmit = !loading && (!providerInfo?.imageRequired || !!imageFile);

  // Ctrl+Enter / Cmd+Enter to generate
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) {
        e.preventDefault();
        void handleSubmit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit]);

  return (
    <>
      <section id="designer" className="px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="heading text-3xl md:text-4xl mb-1">{t('designer.title')}</h3>
              <p className="text-fg-2 text-sm">{t('designer.subtitle')}</p>
            </div>
            <motion.button
              type="button"
              onClick={handleRandomize}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary gap-2 whitespace-nowrap"
            >
              <Dice5 className="w-4 h-4 text-accent-500" />
              {t('random.button')}
            </motion.button>
          </div>


          <div className="grid lg:grid-cols-2 gap-5">
            <div className="space-y-5">
              <ImageUpload
                imageFile={imageFile}
                imagePreview={imagePreview}
                onChange={handleImageChange}
              />
              <RoomSelector value={roomType} onChange={setRoomType} />
              <VariantsControl value={variants} onChange={setVariants} />
            </div>

            <div className="space-y-5">
              <StyleSelector value={style} onChange={setStyle} />
              <PaletteSelector value={palette} onChange={setPalette} />
              <AdvancedSettings values={advanced} onChange={setAdvanced} />
            </div>
          </div>

          {/* Prompt + quick prompts card */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquarePlus className="w-4 h-4 text-accent-500" />
              <h3 className="font-display font-semibold text-lg">
                {t('prompt.title')}{' '}
                <span className="text-fg-3 font-normal text-sm">{t('prompt.optional')}</span>
              </h3>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              maxLength={500}
              placeholder={t('prompt.placeholder')}
              className="input resize-none"
              rows={3}
            />
            <p className="text-xs text-fg-3 mt-1 text-right">{customPrompt.length} / 500</p>
            <div className="mt-4">
              <QuickPrompts selected={quickPrompts} onToggle={toggleQuickPrompt} />
            </div>

            {/* Save preset row */}
            <div className="mt-4 pt-4 border-t border-border">
              <AnimatePresence mode="wait">
                {savingPreset ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex gap-2"
                  >
                    <input
                      ref={presetNameRef}
                      type="text"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePreset();
                        if (e.key === 'Escape') { setSavingPreset(false); setPresetName(''); }
                      }}
                      maxLength={40}
                      placeholder={t('presets.namePlaceholder')}
                      className="input flex-1 !py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSavePreset}
                      disabled={!presetName.trim()}
                      className="btn-primary text-sm px-3 py-1.5 disabled:opacity-40"
                    >
                      {t('presets.save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSavingPreset(false); setPresetName(''); }}
                      className="btn-secondary text-sm px-2 py-1.5"
                      aria-label={t('presets.saveCancel')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="trigger"
                    type="button"
                    onClick={() => setSavingPreset(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="btn-secondary text-sm gap-2"
                  >
                    <BookmarkPlus className="w-4 h-4 text-accent-500" />
                    {t('presets.save')}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Generate / Cancel row */}
          <div className="flex justify-center gap-3">
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.005 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              className="btn-primary text-base min-w-[220px]"
            >
              <Wand2 className="w-5 h-5" />
              {loading ? t('submit.loading') : t('submit.go')}
            </motion.button>
            <AnimatePresence>
              {loading && (
                <motion.button
                  key="cancel"
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="btn-secondary text-base"
                >
                  <X className="w-5 h-5" />
                  {t('submit.cancel')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Show prompt toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowPrompt((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-fg-3 hover:text-fg-1 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPrompt ? 'rotate-180' : ''}`} />
              {showPrompt ? t('prompt.hide') : t('prompt.show')}
            </button>
          </div>

          <AnimatePresence>
            {showPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="card !bg-surface-2 relative">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="absolute top-3 right-3 flex items-center gap-1 text-xs text-fg-3 hover:text-fg-1 transition-colors"
                  >
                    {promptCopied
                      ? <><Check className="w-3.5 h-3.5 text-green-500" />{t('prompt.copied')}</>
                      : <><Copy className="w-3.5 h-3.5" />{t('prompt.copy')}</>
                    }
                  </button>
                  <p className="text-xs font-mono text-fg-2 leading-relaxed pr-24 whitespace-pre-wrap break-words">
                    {currentPrompt}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ResultViewer
            originalUrl={imagePreview}
            variants={resultUrls}
            loading={loading}
            regeneratingIndex={regeneratingIndex}
            expectedMs={providerInfo?.provider === 'replicate' ? 45_000 : 15_000}
            onRetry={handleSubmit}
            onRetryOne={handleRetryOne}
          />
        </div>
      </section>

      <PresetsPanel
        items={presets.items}
        onApply={handleApplyPreset}
        onRemove={presets.remove}
        onClear={presets.clear}
      />

      <HistoryPanel
        items={history.items}
        onRestore={restoreFromHistory}
        onRemove={history.remove}
        onClear={history.clear}
      />
    </>
  );
}
