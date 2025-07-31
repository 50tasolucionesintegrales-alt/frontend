'use client'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function ProductSelectionModal({
  items,
  onSelect,
}: {
  items: any[]
  onSelect: (items: any[]) => void
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any[]>([])

  const filtered = items.filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const toggleItem = (item: any) => {
    const newSelected = selected.some(s => s.id === item.id)
      ? selected.filter(s => s.id !== item.id)
      : [...selected, item]
    setSelected(newSelected)
    onSelect(newSelected)
  }

  return (
    <div className="space-y-4 p-1">
      {/* Buscador */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#999999]" />
        </div>
        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-[#999999] hover:text-[#174940]" />
          </button>
        )}
      </div>

      {/* Contador de seleccionados */}
      {selected.length > 0 && (
        <div className="text-sm text-[#174940] font-medium">
          {selected.length} {selected.length === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
        </div>
      )}

      {/* Lista */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <ul className="overflow-auto max-h-64 divide-y divide-[#e5e7eb]">
          {filtered.length === 0 ? (
            <li className="py-8 text-center">
              <div className="flex flex-col items-center justify-center text-[#999999]">
                <Search className="h-8 w-8 mb-2 text-[#e5e7eb]" />
                <p className="font-medium text-[#174940]">No se encontraron resultados</p>
                <p className="text-sm">Intenta con otro término de búsqueda</p>
              </div>
            </li>
          ) : (
            filtered.map(item => {
              const isSelected = selected.some(s => s.id === item.id)
              return (
                <li 
                  key={item.id} 
                  className={`hover:bg-[#f0f7f5] transition-colors ${isSelected ? 'bg-[#f0f7f5]' : ''}`}
                >
                  <label className="flex items-center px-4 py-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(item)}
                        className="h-4 w-4 text-[#63B23D] border-[#e5e7eb] rounded focus:ring-[#63B23D]"
                      />
                    </div>
                    <span className="ml-3 text-sm text-[#0F332D]">
                      {item.nombre}
                    </span>
                  </label>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}