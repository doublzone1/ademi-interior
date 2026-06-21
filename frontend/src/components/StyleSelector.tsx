import { Layers, Search } from 'lucide-react';
import { useState } from 'react';
import { STYLES, STYLE_LABELS, STYLE_DESCRIPTIONS } from '../lib/constants';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function StyleSelector({ value, onChange }: Props) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? STYLES.filter((s) => STYLE_LABELS[locale][s.id]?.toLowerCase().includes(q))
    : STYLES;

  return (
    <div id="styles" className="card">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-accent-500" />
        <h3 className="font-display font-semibold text-lg flex-1">{t('style.title')}</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('style.search')}
            className="input !py-1 !pl-8 !pr-3 text-xs w-36 sm:w-44"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.length === 0 ? (
          <p className="col-span-full text-sm text-fg-3 py-4 text-center">{query}</p>
        ) : filtered.map((style) => {
          const active = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              className={`option-card ${active ? 'option-card-active' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{style.icon}</span>
                <span className="font-semibold text-sm">{STYLE_LABELS[locale][style.id]}</span>
              </div>
              <p className="text-xs text-fg-3 leading-snug">
                {STYLE_DESCRIPTIONS[locale][style.id]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
