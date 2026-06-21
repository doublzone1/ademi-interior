import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n/I18nProvider';

export interface HistoryItem {
  id: string;
  createdAt: number;
  imageUrls: string[];
  params: {
    roomType: string;
    style: string;
    colorPalette: string;
    customPrompt?: string;
    lighting?: string;
    cameraAngle?: string;
    furnitureDensity?: string;
    material?: string;
    model?: string;
    aspectRatio?: string;
  };
  thumbnailDataUrl?: string;
}

const STORAGE_KEY = 'app.history.v1';
const MAX_ITEMS = 20;
const THUMB_W = 200;
const THUMB_H = 150;

function resizeDataUrl(dataUrl: string, w: number, h: number): Promise<string> {
  // Remote URLs (non-data:) are returned as-is — they're tiny strings
  if (!dataUrl.startsWith('data:')) return Promise.resolve(dataUrl);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(dataUrl); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function load(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: HistoryItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function useHistory() {
  const { t } = useI18n();
  const [items, setItems] = useState<HistoryItem[]>(() => load());

  useEffect(() => {
    if (!save(items)) {
      toast.error(t('errors.storageQuota'), { id: 'storage-quota' });
    }
  }, [items, t]);

  const add = useCallback(async (item: Omit<HistoryItem, 'id' | 'createdAt'>) => {
    let thumbnail = item.thumbnailDataUrl;
    if (thumbnail) {
      try { thumbnail = await resizeDataUrl(thumbnail, THUMB_W, THUMB_H); } catch { /* keep original */ }
    }
    setItems((prev) => {
      const next: HistoryItem = {
        ...item,
        thumbnailDataUrl: thumbnail,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      return [next, ...prev].slice(0, MAX_ITEMS);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, remove, clear };
}
