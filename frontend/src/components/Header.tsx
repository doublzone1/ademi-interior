import { Sparkles, Sun, Moon, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { useI18n } from '../i18n/I18nProvider';
import { LOCALES } from '../i18n/messages';
import { PwaInstall } from './PwaInstall';

export function Header() {
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);

  const currentLocale = LOCALES.find((l) => l.id === locale);

  return (
    <header className="relative z-20 px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent-500/40 blur-lg rounded-full" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">
              Interior <span className="text-accent-500">AI</span>
            </h1>
            <p className="text-xs text-fg-3">{t('tagline')}</p>
          </div>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex items-center gap-6 text-sm text-fg-2"
        >
          <a href="#how" className="hover:text-fg transition">{t('nav.how')}</a>
          <a href="#styles" className="hover:text-fg transition">{t('nav.styles')}</a>
          <a href="#history" className="hover:text-fg transition">{t('history.title')}</a>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              className="icon-btn !w-auto px-3 gap-1.5"
              aria-label={t('language.toggle')}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">
                {currentLocale?.flag} {currentLocale?.id.toUpperCase()}
              </span>
            </button>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-1.5 glass-strong rounded-xl p-1 min-w-[160px] z-30 shadow-lg"
              >
                {LOCALES.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLocale(loc.id);
                      setLangOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-white/10 transition ${
                      locale === loc.id ? 'text-accent-400' : 'text-fg-2'
                    }`}
                  >
                    <span>{loc.flag}</span>
                    <span>{loc.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <PwaInstall />

          <button
            type="button"
            onClick={toggle}
            className="icon-btn"
            aria-label={t('theme.toggle')}
            title={t('theme.toggle')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </motion.div>
      </div>
    </header>
  );
}
