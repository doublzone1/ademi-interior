import { useCallback, useEffect, useState } from 'react';
import type { AdvancedValues } from '../components/AdvancedSettings';

export interface PresetItem {
  id: string;
  name: string;
  createdAt: number;
  roomType: string;
  style: string;
  colorPalette: string;
  advanced: AdvancedValues;
  quickPrompts: string[];
  customPrompt: string;
}

const STORAGE_KEY = 'app.presets.v1';
const MAX_ITEMS = 12;

function load(): PresetItem[] {
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

function save(items: PresetItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function usePresets() {
  const [items, setItems] = useState<PresetItem[]>(() => load());

  useEffect(() => {
    save(items);
  }, [items]);

  const add = useCallback((item: Omit<PresetItem, 'id' | 'createdAt'>) => {
    setItems((prev) => {
      const next: PresetItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
      return [next, ...prev].slice(0, MAX_ITEMS);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, remove, clear };
}
