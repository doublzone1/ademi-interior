import { Bookmark, Trash2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../i18n/I18nProvider';
import type { PresetItem } from '../hooks/usePresets';
import { COLOR_PALETTES, ROOM_TYPES, STYLES, ROOM_LABELS, STYLE_LABELS } from '../lib/constants';

interface Props {
  items: PresetItem[];
  onApply: (item: PresetItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function PresetsPanel({ items, onApply, onRemove, onClear }: Props) {
  const { t, locale } = useI18n();

  if (items.length === 0) return null;

  return (
    <section id="presets" className="px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent-500" />
            <h3 className="heading text-2xl md:text-3xl">{t('presets.title')}</h3>
          </div>
          <button onClick={onClear} className="btn-secondary text-xs">
            <Trash2 className="w-3.5 h-3.5" />
            {t('presets.clear')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <AnimatePresence>
            {items.map((it) => {
              const palette = COLOR_PALETTES.find((p) => p.id === it.colorPalette);
              const room = ROOM_TYPES.find((r) => r.id === it.roomType);
              const style = STYLES.find((s) => s.id === it.style);
              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card !p-3 group relative flex flex-col"
                >
                  <div className="flex rounded-lg overflow-hidden h-3 mb-3 flex-shrink-0">
                    {palette?.colors.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>

                  <p className="text-sm font-semibold truncate mb-0.5">{it.name}</p>
                  <p className="text-[11px] text-fg-3 truncate">
                    {room?.icon} {ROOM_LABELS[locale][it.roomType] ?? it.roomType}
                    {' · '}
                    {style?.icon} {STYLE_LABELS[locale][it.style] ?? it.style}
                  </p>

                  <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onApply(it)}
                      className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      {t('presets.apply')}
                    </button>
                    <button
                      onClick={() => onRemove(it.id)}
                      className="text-xs p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                      aria-label="Delete preset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
