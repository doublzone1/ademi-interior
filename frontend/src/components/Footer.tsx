import { useI18n } from '../i18n/I18nProvider';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="px-6 py-10 border-t mt-16" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-fg-3">
        <p>© {new Date().getFullYear()} Interior Design AI · {t('footer.tagline')}</p>
        <p>{t('footer.poweredBy')}</p>
      </div>
    </footer>
  );
}
