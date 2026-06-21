import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { I18nProvider } from './i18n/I18nProvider';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Designer } from './components/Designer';
import { Footer } from './components/Footer';
import { PwaUpdate } from './components/PwaUpdate';

function ToastsForTheme() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1c2c3f' : '#ffffff',
          color: theme === 'dark' ? '#f4f7fb' : '#172638',
          border:
            theme === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(15,30,50,0.08)',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#e88940', secondary: '#fff' } },
      }}
    />
  );
}

function Shell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Designer />
      </main>
      <Footer />
      <ToastsForTheme />
      <PwaUpdate />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Shell />
      </I18nProvider>
    </ThemeProvider>
  );
}
