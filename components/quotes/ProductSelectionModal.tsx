'use client'
import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'

type SelectableRow = {
  id: string | number
  nombre: string
  precio?: number | string
  precioBase?: number | string
  costo?: number | string
  unidad?: string
} & Record<string, unknown>

type SelItem = {
  id: string | number
  nombre: string
  cantidad: number
  precio: number
  unidad?: string
}

type ProductSelectionModalProps = {
  items: ReadonlyArray<SelectableRow>
  onSelect: (items: SelItem[]) => void
  defaultUnidad?: string
}

export default function ProductSelectionModal({
  items,
  onSelect,
  defaultUnidad = 'pieza',
}: ProductSelectionModalProps
) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<SelItem[]>([])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(i => i.nombre?.toLowerCase().includes(q))
  }, [items, search])

  const parsePrecio = (v: unknown): number => {
    if (typeof v === 'number') return v
    if (typeof v !== 'string') return 0
    const clean = v
      .replace(/[^\d,.\-]/g, '')           // quita $ y letras
      .replace(/\.(?=\d{3}(?:\D|$))/g, '') // quita miles con punto
      .replace(/,(?=\d{3}(?:\D|$))/g, '')  // quita miles con coma
      .replace(',', '.')                   // coma decimal → punto
    const n = Number(clean)
    return Number.isFinite(n) ? n : 0
  }

  // Precio inicial que viene del listado de items
  const getPrecioInicial = (row: SelectableRow): number => {
    // productos: row.precio (string/number)
    // servicios: row.precioBase (o ajusta a row.costo si así lo tienes)
    return parsePrecio(row.precio ?? row.precioBase ?? row.costo ?? 0)
  }

  const toggleItem = (row: SelectableRow) => {
    const exists = selected.find(s => String(s.id) === String(row.id))
    let next: SelItem[]
    if (exists) {
      next = selected.filter(s => String(s.id) !== String(row.id))
    } else {
      next = [
        ...selected,
        {
          id: row.id,
          nombre: row.nombre,
          cantidad: 1,
          precio: +getPrecioInicial(row).toFixed(2),
          unidad: (row.unidad ?? defaultUnidad).toString().trim() || defaultUnidad,
        },
      ]
    }
    setSelected(next)
    onSelect(next)
  }

  const updateCantidad = (id: string | number, value: string) => {
    const n = Number(value)
    const cantidad = Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
    const next = selected.map(s => (String(s.id) === String(id) ? { ...s, cantidad } : s))
    setSelected(next)
    onSelect(next)
  }

  const updatePrecio = (id: string | number, value: string) => {
    const n = parsePrecio(value)
    const next = selected.map(s => (String(s.id) === String(id) ? { ...s, precio: +n.toFixed(2) } : s))
    setSelected(next)
    onSelect(next)
  }

  const selectAllFiltered = () => {
    // añade los no seleccionados de la lista filtrada
    const map = new Map<string, SelItem>(selected.map(s => [String(s.id), s]))
    filtered.forEach(row => {
      const key = String(row.id)
      if (!map.has(key)) {
        map.set(key, {
          id: row.id,
          nombre: row.nombre,
          cantidad: 1,
          precio: +getPrecioInicial(row).toFixed(2),
          unidad: (row.unidad ?? defaultUnidad).toString().trim() || defaultUnidad,
        })
      }
    })
    const next = Array.from(map.values())
    setSelected(next)
    onSelect(next)
  }

  const clearSelection = () => {
    setSelected([])
    onSelect([])
  }

  const isChecked = (id: string | number): boolean => selected.some((s: SelItem) => String(s.id) === String(id))

  return (
    <div className="space-y-4 p-1">
      {/* Buscador */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#999999]" />
        </div>
        <input
          placeholder="Buscar…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
        />
        {search && (
          <button
            title='cerrar'
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-[#999999] hover:text-[#174940]" />
          </button>
        )}
      </div>

      {/* Barra de acciones y contador */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#174940] font-medium">
          {selected.length} {selected.length === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAllFiltered}
            className="px-3 py-1.5 text-sm bg-white border border-[#e5e7eb] rounded-lg hover:bg-gray-50"
          >
            Seleccionar filtrados
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="px-3 py-1.5 text-sm bg-white border border-[#e5e7eb] rounded-lg hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>
      </div>

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
            filtered.map(row => {
              const checked = isChecked(row.id)
              const sel = selected.find(s => String(s.id) === String(row.id))
              return (
                <li key={row.id} className={`transition-colors ${checked ? 'bg-[#f0f7f5]' : 'hover:bg-[#f0f7f5]'}`}>
                  <div className="px-4 py-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(row)}
                        className="h-4 w-4 text-[#63B23D] border-[#e5e7eb] rounded focus:ring-[#63B23D]"
                      />
                      <span className="ml-3 text-sm text-[#0F332D] flex-1">{row.nombre}</span>
                      {/* Muestra precio base a la derecha */}
                      <span className="text-xs text-[#174940]/70">
                        ${getPrecioInicial(row).toFixed(2)}
                      </span>
                    </label>

                    {/* Si está seleccionado, muestra edición rápida */}
                    {checked && sel && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 pl-7">
                        <div>
                          <label className="block text-xs text-[#174940]/80 mb-1">Cantidad</label>
                          <input
                            title='cantidad'
                            type="number"
                            min={1}
                            step={1}
                            value={sel.cantidad}
                            onChange={(e) => updateCantidad(sel.id, e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#174940]/80 mb-1">Costo unitario</label>
                          <input
                            title='costo'
                            type="number"
                            step="0.01"
                            value={sel.precio}
                            onChange={(e) => updatePrecio(sel.id, e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-xs text-[#174940]/80 mb-1">Unidad</label>
                          <input
                            title='unidad'
                            type="text"
                            value={sel.unidad ?? defaultUnidad}
                            onChange={(e) => {
                              const next = selected.map(s =>
                                String(s.id) === String(sel.id) ? { ...s, unidad: e.target.value || defaultUnidad } : s
                              )
                              setSelected(next)
                              onSelect(next)
                            }}
                            className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
