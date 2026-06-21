import { useState, useEffect } from 'react';
import { MonitorSmartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setDeferred(null));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferred) return null;

  const handleInstall = async () => {
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setDeferred(null);
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      title="Установить приложение"
      className="icon-btn !w-auto px-3 gap-1.5 text-accent-500 border border-accent-500/30 hover:border-accent-500/60"
    >
      <MonitorSmartphone className="w-4 h-4" />
      <span className="text-xs font-medium hidden sm:inline">Install</span>
    </button>
  );
}
