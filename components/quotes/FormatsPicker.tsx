'use client'
import { CheckSquare, XSquare } from 'lucide-react'

export function FormatsPicker({
  selected, toggle, selectAll, clearAll, disabled = false
}: {
  selected: number[]
  toggle: (n:number)=>void
  selectAll: ()=>void
  clearAll: ()=>void
  disabled?: boolean
}) {
  const ALL = [1,2,3,4,5,6,7]

  const EMPRESAS = [
    'Goltech',
    'Juan Angel Bazan Gonzales',
    'Alejandra Giselle Hernández Islas',
    'Adrián Orihuela Rodríguez',
    'Mariana Loeza Hernández',
    'Michelle',
    'Chalor'
  ]

  return (
    <div className="mb-4 mt-1 p-4 bg-white rounded-xl border border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-[#0F332D]">Formatos a usar:</span>
        <div className="flex flex-wrap gap-2">
          {ALL.map((n, i) => (
            <label key={n} className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer select-none ${
              selected.includes(n)
                ? 'bg-[#174940] text-white border-[#174940]'
                : 'bg-white text-[#174940] border-[#e5e7eb] hover:bg-[#f0f7f5]'
            }`}>
              <input
                type="checkbox"
                className="sr-only"
                disabled={disabled}
                checked={selected.includes(n)}
                onChange={() => toggle(n)}
              />
              {EMPRESAS[i]}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] flex items-center gap-2"
        >
          <CheckSquare className="h-4 w-4" /> Seleccionar todo
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-white border border-[#e5e7eb] text-[#0F332D] rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <XSquare className="h-4 w-4" /> Limpiar
        </button>
      </div>
    </div>
  )
}