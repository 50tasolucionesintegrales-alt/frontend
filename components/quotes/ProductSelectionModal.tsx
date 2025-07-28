'use client'
import { Producto, Service } from '@/src/schemas'
import { useEffect, useState } from 'react'

export default function ProductSelectionModal({
  onSelect,
  token,
  products,
  services
}: {
  onSelect: (items: any[]) => void
  token: string | undefined
  products: Producto[]
  services: Service[]
}) {
  const [tipo, setTipo] = useState<'products' | 'services'>('products')
  const [all, setAll] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])

  useEffect(() => {
    setAll(tipo === 'products' ? products : services)
  }, [tipo, products, services])

  const filtered = all.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const selectedTipo = selected.length > 0
    ? products.find(p => p.id === selected[0]?.id) ? 'products' : 'services'
    : null

  return (
    <div className="space-y-4">
      {/* Tipo selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setTipo('products')}
          className={`px-4 py-2 rounded-lg border ${tipo === 'products' ? 'bg-indigo-100 border-indigo-500' : 'bg-white'}`}
        >
          Productos
        </button>
        <button
          onClick={() => setTipo('services')}
          className={`px-4 py-2 rounded-lg border ${tipo === 'services' ? 'bg-indigo-100 border-indigo-500' : 'bg-white'}`}
        >
          Servicios
        </button>
      </div>

      {/* Buscador */}
      <input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      {/* Lista */}
      <ul className="overflow-auto h-64 space-y-2">
        {filtered.length === 0 ? (
          <span>No hay elementos para agregar</span>
        ) : (
          filtered.map(item => {
            const isAlreadySelected = selected.some(s => s.id === item.id)
            const itemTipo = tipo
            const isDisabled =
              selectedTipo && selectedTipo !== itemTipo && !isAlreadySelected

            return (
              <li key={item.id}>
                <label className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="checkbox"
                    disabled={!!isDisabled}
                    checked={isAlreadySelected}
                    onChange={e => {
                      const newSelected = e.target.checked
                        ? [...selected, item]
                        : selected.filter(s => s.id !== item.id)
                      setSelected(newSelected)
                      onSelect(newSelected)
                    }}
                  />
                  {item.nombre}
                  {isDisabled && (
                    <span className="text-xs text-red-500 ml-2">(no se puede mezclar)</span>
                  )}
                </label>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
