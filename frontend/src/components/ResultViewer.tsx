import { Download, RefreshCw, ImageOff, Maximize2, GitCompareArrows, LayoutGrid, ArrowLeft, Share2, Clipboard, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n/I18nProvider';
import { Lightbox } from './Lightbox';
import { CompareSlider } from './CompareSlider';
import { ProgressBar } from './ProgressBar';

interface Props {
  originalUrl: string | null;
  variants: string[];
  loading: boolean;
  /** Index of the variant currently being regenerated individually, or null. */
  regeneratingIndex?: number | null;
  /** Expected generation time in ms — used to animate the progress bar realistically. */
  expectedMs?: number;
  onRetry?: () => void;
  onRetryOne?: (index: number) => void;
}

export function ResultViewer({
  originalUrl,
  variants,
  loading,
  regeneratingIndex = null,
  expectedMs = 15_000,
  onRetry,
  onRetryOne,
}: Props) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);
  const [compareAll, setCompareAll] = useState(false);

  const current = variants[active] ?? null;
  const activeIsRegenerating = regeneratingIndex === active;
  const mainLoading = loading || activeIsRegenerating;
  const anyBusy = loading || regeneratingIndex !== null;

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard?.write;
  const [copiedImage, setCopiedImage] = useState(false);

  const handleCopyImage = async () => {
    if (!current) return;
    try {
      const res = await fetch(current);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type || 'image/png']: blob })]);
      setCopiedImage(true);
      toast.success(t('result.copied'));
      setTimeout(() => setCopiedImage(false), 2000);
    } catch {
      toast.error(t('errors.generic'));
    }
  };

  const downloadBlob = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const handleDownload = async () => {
    if (!current) return;
    try {
      await downloadBlob(current, `interior-design-${Date.now()}.png`);
      toast.success(t('success.downloaded'));
    } catch {
      toast.error(t('errors.generic'));
    }
  };

  const handleDownloadAll = async () => {
    const ts = Date.now();
    for (let i = 0; i < variants.length; i++) {
      try {
        await downloadBlob(variants[i], `interior-design-${ts}-${i + 1}.png`);
        if (i < variants.length - 1) await new Promise((r) => setTimeout(r, 400));
      } catch { /* skip failed */ }
    }
    toast.success(t('result.downloadAll'));
  };

  const handleShare = async () => {
    if (!current) return;
    try {
      await navigator.share({ title: 'Interior Design AI', url: current });
    } catch (e) {
      if ((e as DOMException).name !== 'AbortError') toast.error(t('errors.generic'));
    }
  };

  const stages = [
    { at: 30, label: '⏳ ' + t('result.loading') },
    { at: 70, label: '🎨 ' + t('result.loading') },
    { at: 95, label: '✨ ' + t('result.loading') },
  ];

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h3 className="font-display font-semibold text-lg">{t('result.title')}</h3>
          {current && !mainLoading && (
            <div className="flex gap-2 flex-wrap">
              {compareAll ? (
                <button
                  onClick={() => setCompareAll(false)}
                  className="btn-secondary text-xs !bg-accent-500/20 !border-accent-500/40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t('result.exitCompare')}
                </button>
              ) : (
                <>
                  {variants.length > 1 && (
                    <button
                      onClick={() => { setCompareAll(true); setCompare(false); }}
                      className="btn-secondary text-xs"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      {t('result.compareAll')}
                    </button>
                  )}
                  {originalUrl && (
                    <button
                      onClick={() => setCompare((v) => !v)}
                      className={`btn-secondary text-xs ${compare ? '!bg-accent-500/20 !border-accent-500/40' : ''}`}
                    >
                      <GitCompareArrows className="w-3.5 h-3.5" />
                      {t('result.compare')}
                    </button>
                  )}
                  <button onClick={() => setLightbox(current)} className="btn-secondary text-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                    {t('result.fullscreen')}
                  </button>
                  {onRetry && (
                    <button onClick={onRetry} disabled={anyBusy} className="btn-secondary text-xs">
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t('result.retry')}
                    </button>
                  )}
                  {canCopy && (
                    <button onClick={handleCopyImage} className="btn-secondary text-xs">
                      {copiedImage ? <ClipboardCheck className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                      {copiedImage ? t('result.copied') : t('result.copy')}
                    </button>
                  )}
                  {canShare && (
                    <button onClick={handleShare} className="btn-secondary text-xs">
                      <Share2 className="w-3.5 h-3.5" />
                      {t('result.share')}
                    </button>
                  )}
                  <button onClick={handleDownload} className="btn-secondary text-xs">
                    <Download className="w-3.5 h-3.5" />
                    {t('result.download')}
                  </button>
                  {variants.length > 1 && (
                    <button onClick={handleDownloadAll} className="btn-secondary text-xs">
                      <Download className="w-3.5 h-3.5" />
                      {t('result.downloadAll')}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {(loading || activeIsRegenerating) && (
          <div className="mb-4">
            <ProgressBar active={loading || activeIsRegenerating} expectedMs={expectedMs} stages={stages} />
          </div>
        )}

        {compareAll && !mainLoading ? (
          <CompareAllGrid
            variants={variants}
            active={active}
            regeneratingIndex={regeneratingIndex}
            anyBusy={anyBusy}
            onSelect={(i) => { setActive(i); setCompareAll(false); }}
            onOpen={(u) => setLightbox(u)}
            onRetryOne={onRetryOne}
          />
        ) : compare && originalUrl && current && !mainLoading ? (
          <CompareSlider beforeUrl={originalUrl} afterUrl={current} className="aspect-[4/3] w-full" />
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            <Pane label={t('result.original')} url={originalUrl} onOpen={(u) => setLightbox(u)} />
            <Pane
              label={t('result.new')}
              url={current}
              loading={mainLoading}
              onOpen={(u) => setLightbox(u)}
            />
          </div>
        )}

        {variants.length > 1 && !loading && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {variants.map((u, i) => {
              const isRegen = regeneratingIndex === i;
              return (
                <div key={i} className="relative aspect-[4/3]">
                  {/* Thumbnail button */}
                  <button
                    type="button"
                    onClick={() => { setActive(i); setCompare(false); }}
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition
                      ${active === i ? 'border-accent-500' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <ThumbImg src={u} alt={`variant ${i + 1}`} className="w-full h-full object-cover" />
                  </button>

                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] rounded bg-black/60 text-white font-medium pointer-events-none z-10">
                    #{i + 1}
                  </span>

                  {/* Per-variant regenerate button (hover) */}
                  {!isRegen && onRetryOne && !anyBusy && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActive(i); onRetryOne(i); }}
                      title={t('result.retryOne')}
                      className="absolute inset-0 rounded-lg bg-black/0 hover:bg-black/55 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-20"
                    >
                      <RefreshCw className="w-5 h-5 text-white drop-shadow" />
                    </button>
                  )}

                  {/* Spinner while this variant is regenerating */}
                  {isRegen && (
                    <div className="absolute inset-0 rounded-lg bg-black/60 flex items-center justify-center z-20">
                      <RefreshCw className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Lightbox imageUrl={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}

function CompareAllGrid({
  variants,
  active,
  regeneratingIndex,
  anyBusy,
  onSelect,
  onOpen,
  onRetryOne,
}: {
  variants: string[];
  active: number;
  regeneratingIndex: number | null;
  anyBusy: boolean;
  onSelect: (i: number) => void;
  onOpen: (url: string) => void;
  onRetryOne?: (i: number) => void;
}) {
  const { t } = useI18n();
  const cols =
    variants.length === 2 ? 'grid-cols-2' :
    variants.length === 3 ? 'grid-cols-3' :
    'grid-cols-2';

  return (
    <div className={`grid ${cols} gap-3`}>
      {variants.map((u, i) => {
        const isRegen = regeneratingIndex === i;
        return (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer
              ring-2 transition-all ${active === i ? 'ring-accent-500' : 'ring-transparent hover:ring-accent-500/50'}`}
          >
            <ThumbImg
              src={u}
              alt={`variant ${i + 1}`}
              className="w-full h-full object-cover"
              onClick={() => onOpen(u)}
            />
            {/* Number badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-bold pointer-events-none">
              #{i + 1}
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-3 gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect(i); }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium"
              >
                {t('presets.apply')}
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onOpen(u); }}
                className="text-xs p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              {onRetryOne && !anyBusy && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRetryOne(i); }}
                  className="text-xs p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                  title={t('result.retryOne')}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Spinner while regenerating */}
            {isRegen && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function ThumbImg({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) {
  const [err, setErr] = useState(false);
  return err ? (
    <div className={`flex items-center justify-center bg-black/30 ${className ?? ''}`} onClick={onClick}>
      <ImageOff className="w-4 h-4 opacity-40 text-fg-3" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} onError={() => setErr(true)} onClick={onClick} />
  );
}

function Pane({
  label, url, loading, onOpen,
}: {
  label: string;
  url: string | null;
  loading?: boolean;
  onOpen: (url: string) => void;
}) {
  const { t } = useI18n();
  const [imgError, setImgError] = useState(false);

  // Reset error state whenever the URL changes (new generation)
  useEffect(() => { setImgError(false); }, [url]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black/30 aspect-[4/3]">
      <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-medium text-white">
        {label}
      </div>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:1000px_100%] animate-shimmer" />
            <div className="relative w-12 h-12 rounded-full border-2 border-accent-400/30 border-t-accent-400 animate-spin" />
            <p className="relative text-sm text-fg-2">{t('result.loading')}</p>
            <p className="relative text-xs text-fg-3">{t('result.loadingHint')}</p>
          </motion.div>
        )}
        {!loading && url && !imgError && (
          <motion.button
            key={url}
            type="button"
            onClick={() => onOpen(url)}
            className="absolute inset-0 group"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={url}
              alt={label}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
          </motion.button>
        )}
        {!loading && (!url || imgError) && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-fg-3"
          >
            <ImageOff className="w-8 h-8 opacity-40" />
            <p className="text-xs">{imgError ? t('errors.imageExpired') : t('result.empty')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
