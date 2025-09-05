'use client'
import { useEffect, useRef, useState } from 'react'
import type { Item } from '@/src/schemas'

export function useStableItems(quoteId: string, incoming: Item[]) {
  const orderRef = useRef<Record<string, number>>({})
  const [items, setItems] = useState<Item[]>(incoming)

  useEffect(() => {
    orderRef.current = {}
    incoming.forEach((it, idx) => { orderRef.current[String(it.id)] = idx })
    setItems(incoming)
  }, [quoteId]) // solo al cambiar de cotización

  useEffect(() => {
    // reinyecta manteniendo orden
    setItems(prev => {
      if (!prev.length) return incoming
      const map = new Map(incoming.map(i => [String(i.id), i]))
      const next = prev.map(p => map.get(String(p.id)) ?? p)
      // agrega nuevos que no existían al final
      incoming.forEach(i => {
        if (!prev.find(p => String(p.id) === String(i.id))) next.push(i)
      })
      return next
    })
  }, [incoming])

  return { items, setItems, orderRef }
}
