'use client'
import { useEffect, useState } from 'react'

const clampFormats = (arr: number[]) =>
  Array.from(new Set(arr.map(n => Math.max(1, Math.min(7, Number(n)||0)))))
    .filter(Boolean)
    .sort((a,b)=>a-b)

export function useSelectedFormats(storageKey: string, initial: number[] = [1,2,3]) {
  const [selected, setSelected] = useState<number[]>(initial)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = clampFormats(JSON.parse(raw))
        if (parsed.length) setSelected(parsed)
      }
    } catch {}
  }, [storageKey])

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(selected)) } catch {}
  }, [storageKey, selected])

  const toggle = (n: number) =>
    setSelected(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n].sort((a,b)=>a-b))

  const selectAll = () => setSelected([1,2,3,4,5,6,7])
  const clearAll  = () => setSelected([])

  return { selected, toggle, selectAll, clearAll, setSelected }
}
