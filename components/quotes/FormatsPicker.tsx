'use client'
import { CheckSquare, XSquare } from 'lucide-react'

type Props = {
  selected: number[]
  toggle: (n: number) => void
  selectAll: () => void
  clearAll: () => void
  disabled?: boolean
  hydrated?: boolean
}

export function FormatsPicker({
  selected, toggle, selectAll, clearAll, disabled = false, hydrated = false
}: Props) {

  // 🔟 Formatos disponibles (1..10)
  const FORMATS: { id: number; label: string }[] = [
    { id: 1, label: 'Goltech' },
    { id: 2, label: 'Juan Ángel Bazán' },
    { id: 3, label: 'Alejandra G. Hernández' },
    { id: 4, label: 'Adrián Orihuela' },
    { id: 5, label: 'Mariana Loeza' },
    { id: 6, label: 'Michelle' },
    { id: 7, label: 'Chalor' },
    { id: 8, label: 'LEyses Soluciones' },
    { id: 9, label: 'Eduardo Suárez (ES)' },
    { id: 10, label: 'Jessica Rabadán' },
  ];

  return (
    <div className="mb-4 mt-1 p-4 bg-white rounded-xl border border-[#e5e7eb] flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-[#0F332D]">Formatos a usar:</span>

        {/* Contenedor con scroll horizontal en móviles y wrap en pantallas grandes */}
        <div className="overflow-x-auto sm:overflow-visible">
          <div
            className="
              inline-flex sm:flex sm:flex-wrap
              gap-2 min-w-full sm:min-w-0
              whitespace-nowrap sm:whitespace-normal
              pb-1
            "
            role="group"
            aria-label="Selector de formatos"
          >
            {FORMATS.map(({ id, label }) => {
              const isActive = selected.includes(id)
              return (
                <label
                  key={id}
                  className={
                    `shrink-0 px-3 py-1.5 rounded-lg border text-sm cursor-pointer select-none transition-colors
                    ${isActive
                      ? 'bg-[#174940] text-white border-[#174940]'
                      : 'bg-white text-[#174940] border-[#e5e7eb] hover:bg-[#f0f7f5]'}`
                  }
                  title={`Formato ${id}: ${label}`}
                >
                  {/* Antes de hidratar: NO controlado para evitar mismatch; después: controlado */}
                  {hydrated ? (
                    <input
                      type="checkbox"
                      className="sr-only"
                      disabled={disabled}
                      checked={isActive}
                      onChange={() => toggle(id)}
                      aria-label={`Seleccionar formato ${id}: ${label}`}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className="sr-only"
                      disabled={disabled}
                      defaultChecked={isActive}
                      readOnly
                      aria-label={`Seleccionar formato ${id}: ${label}`}
                      suppressHydrationWarning
                    />
                  )}
                  {label}
                </label>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 sm:justify-end">
        <button
          type="button"
          onClick={selectAll}   // ← usa el setter atómico
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
