// hooks/useSelectedFormats.ts
import { useEffect, useRef, useState } from 'react';

function parseSaved(raw: string | null): number[] | null {
  try {
    const v = JSON.parse(raw ?? 'null');
    return Array.isArray(v) && v.every(n => typeof n === 'number') ? v : null;
  } catch {
    return null;
  }
}

export function useSelectedFormats(key: string, initial: number[]) {
  // Si no quieres parpadeo inicial, puedes usar (() => initial)
  const [selected, setSelected] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Evita re-ini repetida para la misma key aunque 'initial' cambie luego
  const initializedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Sólo inicializa si es la primera vez o si la key cambió
    if (initializedKeyRef.current === key) return;

    const saved = parseSaved(typeof window !== 'undefined' ? localStorage.getItem(key) : null);
    setSelected(saved ?? initial);
    setHydrated(true);
    initializedKeyRef.current = key;
  }, [key, initial]); // ✅ incluye initial (lint feliz)

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(key, JSON.stringify(selected));
  }, [hydrated, key, selected]);

  const selectAll = () => setSelected([1,2,3,4,5,6,7,8,9,10]);
  const clearAll  = () => setSelected([]);
  const toggle    = (n: number) =>
    setSelected(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);

  return { selected, toggle, selectAll, clearAll, hydrated };
}
