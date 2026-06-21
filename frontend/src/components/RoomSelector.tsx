import { Home, Search } from 'lucide-react';
import { useState } from 'react';
import { ROOM_TYPES, ROOM_LABELS } from '../lib/constants';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function RoomSelector({ value, onChange }: Props) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ROOM_TYPES.filter((r) => ROOM_LABELS[locale][r.id]?.toLowerCase().includes(q))
    : ROOM_TYPES;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Home className="w-4 h-4 text-accent-500" />
        <h3 className="font-display font-semibold text-lg flex-1">{t('room.title')}</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('room.search')}
            className="input !py-1 !pl-8 !pr-3 text-xs w-36 sm:w-44"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {filtered.length === 0 ? (
          <p className="col-span-full text-sm text-fg-3 py-4 text-center">{query}</p>
        ) : filtered.map((room) => {
          const active = value === room.id;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onChange(room.id)}
              className={`option-card flex flex-col items-center gap-1.5 ${active ? 'option-card-active' : ''}`}
            >
              <span className="text-2xl">{room.icon}</span>
              <span className="text-xs font-medium text-center text-fg-2">
                {ROOM_LABELS[locale][room.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
