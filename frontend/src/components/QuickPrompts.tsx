import { QUICK_PROMPTS, QUICK_PROMPTS_KEYS, QUICK_PROMPTS_LABELS } from '../lib/constants';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  selected: string[]; // массив ENG-промптов
  onToggle: (prompt: string) => void;
}

export function QuickPrompts({ selected, onToggle }: Props) {
  const { t, locale } = useI18n();
  return (
    <div>
      <p className="text-xs text-fg-3 uppercase tracking-wide mb-2 font-semibold">
        {t('prompt.quick')}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS_KEYS.map((key) => {
          const promptText = QUICK_PROMPTS[key];
          const active = selected.includes(promptText);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(promptText)}
              className={`chip ${active ? 'chip-active' : ''}`}
            >
              {QUICK_PROMPTS_LABELS[locale][key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
