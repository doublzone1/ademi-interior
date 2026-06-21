import { Palette } from 'lucide-react';
import { COLOR_PALETTES, PALETTE_LABELS } from '../lib/constants';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function PaletteSelector({ value, onChange }: Props) {
  const { t, locale } = useI18n();
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-4 h-4 text-accent-500" />
        <h3 className="font-display font-semibold text-lg">{t('palette.title')}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {COLOR_PALETTES.map((palette) => {
          const active = value === palette.id;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => onChange(palette.id)}
              className={`option-card ${active ? 'option-card-active' : ''}`}
            >
              <div className="flex gap-1 mb-2">
                {palette.colors.map((color) => (
                  <span
                    key={color}
                    className="flex-1 h-8 rounded-md border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-fg-2">
                {PALETTE_LABELS[locale][palette.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
