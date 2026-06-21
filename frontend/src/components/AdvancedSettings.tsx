import { Settings2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LIGHTING_OPTIONS, CAMERA_OPTIONS, DENSITY_OPTIONS, MATERIAL_OPTIONS, MODEL_OPTIONS, ASPECT_RATIO_OPTIONS,
  LIGHTING_LABELS, CAMERA_LABELS, DENSITY_LABELS, MATERIAL_LABELS, MODEL_LABELS, ASPECT_RATIO_LABELS,
} from '../lib/constants';
import { useI18n } from '../i18n/I18nProvider';
import type { Locale } from '../i18n/messages';

export interface AdvancedValues {
  lighting: string;
  cameraAngle: string;
  furnitureDensity: string;
  material: string;
  model: string;
  aspectRatio: string;
}

interface Props {
  values: AdvancedValues;
  onChange: (next: AdvancedValues) => void;
}

export function AdvancedSettings({ values, onChange }: Props) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);

  const set = <K extends keyof AdvancedValues>(key: K, val: string) =>
    onChange({ ...values, [key]: val });

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-accent-500" />
          <h3 className="font-display font-semibold text-lg">{t('advanced.title')}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              <Group label={t('advanced.model')} options={MODEL_OPTIONS} labels={MODEL_LABELS} value={values.model} onChange={(v) => set('model', v)} locale={locale} />
              <Group label={t('advanced.aspectRatio')} options={ASPECT_RATIO_OPTIONS} labels={ASPECT_RATIO_LABELS} value={values.aspectRatio} onChange={(v) => set('aspectRatio', v)} locale={locale} />
              <Group label={t('advanced.lighting')} options={LIGHTING_OPTIONS} labels={LIGHTING_LABELS} value={values.lighting} onChange={(v) => set('lighting', v)} locale={locale} />
              <Group label={t('advanced.camera')} options={CAMERA_OPTIONS} labels={CAMERA_LABELS} value={values.cameraAngle} onChange={(v) => set('cameraAngle', v)} locale={locale} />
              <Group label={t('advanced.density')} options={DENSITY_OPTIONS} labels={DENSITY_LABELS} value={values.furnitureDensity} onChange={(v) => set('furnitureDensity', v)} locale={locale} />
              <Group label={t('advanced.material')} options={MATERIAL_OPTIONS} labels={MATERIAL_LABELS} value={values.material} onChange={(v) => set('material', v)} locale={locale} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Group({
  label, options, labels, value, onChange, locale,
}: {
  label: string;
  options: { id: string; icon?: string }[];
  labels: Record<Locale, Record<string, string>>;
  value: string;
  onChange: (v: string) => void;
  locale: Locale;
}) {
  return (
    <div>
      <p className="text-xs text-fg-3 uppercase tracking-wide mb-2 font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`chip ${active ? 'chip-active' : ''}`}
            >
              {opt.icon && <span>{opt.icon}</span>}
              <span>{labels[locale][opt.id]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
