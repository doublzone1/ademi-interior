import { Upload, Palette, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n/I18nProvider';

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: Upload, title: t('how.step1.title'), text: t('how.step1.text') },
    { icon: Palette, title: t('how.step2.title'), text: t('how.step2.text') },
    { icon: Wand2, title: t('how.step3.title'), text: t('how.step3.text') },
  ];

  return (
    <section id="how" className="px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="heading text-3xl md:text-4xl mb-3">{t('how.title')}</h3>
          <p className="text-fg-2">{t('how.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card hover:border-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-500/15 border border-accent-500/30 flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-accent-400" />
              </div>
              <h4 className="font-display font-semibold text-lg mb-2">{step.title}</h4>
              <p className="text-fg-2 text-sm leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
