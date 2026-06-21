import { History, Trash2, RotateCcw, FileDown, ChevronDown, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { HistoryItem } from '../hooks/useHistory';
import { ROOM_LABELS, STYLE_LABELS } from '../lib/constants';

interface Props {
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function exportTxt(items: HistoryItem[]) {
  const lines: string[] = [
    'Interior Design AI — История дизайнов',
    `Экспорт: ${new Date().toLocaleString()}`,
    '',
    ...items.flatMap((it) => [
      `[${new Date(it.createdAt).toLocaleString()}] ${it.params.style} / ${it.params.roomType}`,
      ...it.imageUrls.map((u, i) => `  Вариант ${i + 1}: ${u}`),
      '',
    ]),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  download(blob, `interior-ai-history-${Date.now()}.txt`);
}

function exportHtml(items: HistoryItem[]) {
  const cards = items
    .map(
      (it) => `
    <div class="card">
      <img src="${it.imageUrls[0]}" alt="design" loading="lazy" onerror="this.style.display='none'"/>
      ${
        it.imageUrls.length > 1
          ? `<div class="thumbs">${it.imageUrls
              .slice(1)
              .map((u) => `<img src="${u}" alt="variant" loading="lazy"/>`)
              .join('')}</div>`
          : ''
      }
      <div class="meta">
        <span>${it.params.style}</span>
        <span>${it.params.roomType}</span>
        <span>${new Date(it.createdAt).toLocaleDateString()}</span>
      </div>
    </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Interior Design AI — История</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;background:#0d1b2a;color:#d0dce9;padding:2rem 1rem}
  h1{font-size:1.5rem;margin-bottom:0.5rem;color:#e88940}
  .note{font-size:0.75rem;color:#7a9bb5;margin-bottom:2rem}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:1rem;overflow:hidden}
  .card>img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
  .thumbs{display:flex;gap:4px;padding:4px}
  .thumbs img{flex:1;height:60px;object-fit:cover;border-radius:6px}
  .meta{padding:0.75rem 1rem;display:flex;gap:0.5rem;flex-wrap:wrap;font-size:0.8rem;color:#7a9bb5}
  .meta span:not(:last-child)::after{content:" ·";margin-left:0.25rem}
</style>
</head>
<body>
<h1>Interior Design AI — История</h1>
<p class="note">Экспортировано: ${new Date().toLocaleString()} · URL изображений могут истечь.</p>
<div class="grid">${cards}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  download(blob, `interior-ai-gallery-${Date.now()}.html`);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function CardImg({ src }: { src: string }) {
  const [err, setErr] = useState(false);
  return err ? (
    <div className="w-full h-full flex items-center justify-center bg-black/20 text-fg-3">
      <ImageOff className="w-6 h-6 opacity-40" />
    </div>
  ) : (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
}

export function HistoryPanel({ items, onRestore, onRemove, onClear }: Props) {
  const { t, locale } = useI18n();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <section id="history" className="px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent-500" />
            <h3 className="heading text-2xl md:text-3xl">{t('history.title')}</h3>
          </div>

          {items.length > 0 && (
            <div className="flex gap-2">
              {/* Export dropdown */}
              <div ref={exportRef} className="relative">
                <button
                  onClick={() => setExportOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setExportOpen(false), 150)}
                  className="btn-secondary text-xs gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  {t('history.export')}
                  <ChevronDown className={`w-3 h-3 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {exportOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-full mt-1.5 glass-strong rounded-xl p-1 min-w-[180px] z-30 shadow-lg"
                    >
                      <button
                        onMouseDown={(e) => { e.preventDefault(); exportTxt(items); setExportOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-white/10 transition text-fg-2"
                      >
                        {t('history.exportTxt')}
                      </button>
                      <button
                        onMouseDown={(e) => { e.preventDefault(); exportHtml(items); setExportOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-white/10 transition text-fg-2"
                      >
                        {t('history.exportHtml')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={onClear} className="btn-secondary text-xs">
                <Trash2 className="w-3.5 h-3.5" />
                {t('history.clear')}
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="card text-center py-10 text-fg-3">
            {t('history.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <AnimatePresence>
              {items.map((it) => (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card !p-2 group relative"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2">
                    <CardImg src={it.imageUrls[0]} />
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition gap-1 p-2">
                      <button
                        onClick={() => onRestore(it)}
                        className="text-xs px-2 py-1 rounded bg-accent-500 hover:bg-accent-600 text-white font-medium flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {t('history.restore')}
                      </button>
                      <button
                        onClick={() => onRemove(it.id)}
                        className="text-xs p-1.5 rounded bg-red-500/80 hover:bg-red-600 text-white"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="px-1 pb-1">
                    <p className="text-xs font-semibold truncate">
                      {STYLE_LABELS[locale][it.params.style] ?? it.params.style}
                    </p>
                    <p className="text-[11px] text-fg-3 truncate">
                      {ROOM_LABELS[locale][it.params.roomType] ?? it.params.roomType}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
