import { Layers3 } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  value: number;
  onChange: (n: number) => void;
}

export function VariantsControl({ value, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Layers3 className="w-4 h-4 text-accent-500" />
        <h3 className="font-display font-semibold text-lg">{t('variants.title')}</h3>
      </div>
      <p className="text-xs text-fg-3 mb-3">{t('variants.subtitle')}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex-1 py-2.5 rounded-xl border font-semibold transition
                ${active
                  ? 'option-card-active border-accent-400/60'
                  : 'option-card'
                }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
