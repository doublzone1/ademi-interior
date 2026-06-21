import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-fg-2 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
          </span>
          {t('hero.badge')}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="heading text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6"
        >
          {t('hero.title.before')}
          <span className="bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent">
            {t('hero.title.accent')}
          </span>
          {t('hero.title.after')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-fg-2 max-w-2xl mx-auto mb-10"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.a
          href="#designer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="btn-primary text-base"
        >
          {t('hero.cta')}
          <ArrowDown className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
}
