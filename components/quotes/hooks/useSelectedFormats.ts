// hooks/useSelectedFormats.ts
import { useEffect, useState } from 'react';

export function useSelectedFormats(key: string, initial: number[]) {
  const [selected, setSelected] = useState<number[]>([]);   // SSR/1er paint: vacío
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      setSelected(Array.isArray(saved) ? saved : initial);
    } catch {
      setSelected(initial);
    }
    setHydrated(true);
  }, [key]);

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
