import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../i18n/I18nProvider';

export function PwaUpdate() {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      // Check for updates once per hour
      r && setInterval(() => { void r.update(); }, 60 * 60 * 1000);
    },
  });

  // Suppress unused-variable lint warning — needRefresh drives the banner
  void useEffect;

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-3 glass-strong rounded-xl px-4 py-3 shadow-xl border border-accent-500/30"
        >
          <RefreshCw className="w-4 h-4 text-accent-500 flex-shrink-0" />
          <span className="text-sm">{t('pwa.updateAvailable')}</span>
          <button
            type="button"
            onClick={() => void updateServiceWorker(true)}
            className="text-xs font-semibold text-accent-500 hover:text-accent-400 transition-colors whitespace-nowrap"
          >
            {t('pwa.update')} →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
