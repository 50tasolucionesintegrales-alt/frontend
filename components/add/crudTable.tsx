'use client'

import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'

export type Column<T> = {
  header: string
  render: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

type Props<T> = {
  items: T[]
  columns: Column<T>[]
  getRowId: (row: T) => string
  onEdit?: (row: T) => void
  onDelete?: (id: string) => Promise<void> | void
  searchable?: (row: T, q: string) => boolean
  pageSize?: number
  extraFilters?: React.ReactNode
  title?: string
  /** Opcional: etiqueta amigable para mostrar en el modal (e.g., nombre) */
  getDeleteLabel?: (row: T) => string
}

export default function CrudTable<T>({
  items,
  columns,
  getRowId,
  onEdit,
  onDelete,
  searchable,
  pageSize = 10,
  extraFilters,
  title,
  getDeleteLabel,
}: Props<T>) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  // Estado del modal de confirmación
  const [confirming, setConfirming] = useState<{ row: T; id: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    if (!searchable || !q.trim()) return items
    const needle = q.trim().toLowerCase()
    return items.filter((row) => searchable(row, needle))
  }, [items, searchable, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    const slice = filtered.slice(start, start + pageSize)
    if (slice.length === 0 && page > 1) {
      setPage((p) => Math.max(1, p - 1))
    }
    return slice
  }, [filtered, page, pageSize])

  const handleAskDelete = (row: T) => {
    setConfirming({ row, id: getRowId(row) })
  }

  const handleConfirmDelete = async () => {
    if (!confirming || !onDelete) return
    setDeleting(true)
    try {
      await onDelete(confirming.id)
    } finally {
      setDeleting(false)
      setConfirming(null)
    }
  }

  return (
    <div className="space-y-4">
      {(title || searchable || extraFilters) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-2 bg-white rounded-lg shadow-sm">
          {title && <h2 className="text-xl font-bold text-[#0F332D]">{title}</h2>}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#999999]" />
                </div>
                <input
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1) }}
                />
              </div>
            )}
            {extraFilters}
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-[#174940]">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${c.headerClassName ?? ''}`}
                >
                  {c.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e5e7eb]">
            {paged.map((row) => {
              const id = getRowId(row)
              return (
                <tr key={id} className="hover:bg-[#f0f7f5] transition-colors">
                  {columns.map((c, i) => (
                    <td
                      key={i}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${c.className ?? ''}`}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-[#174940] hover:text-[#0F332D] flex items-center gap-1"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Editar</span>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleAskDelete(row)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
            {paged.length === 0 && (
              <tr>
                <td
                  className="px-6 py-12 text-center text-[#999999]"
                  colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 mb-2 text-[#e5e7eb]" />
                    <p className="text-lg font-medium text-[#174940]">
                      No se encontraron resultados
                    </p>
                    {q && (
                      <p className="mt-1">
                        Intenta con otro término de búsqueda
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-[#999999]">
          Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} de {filtered.length} registros
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#174940] text-white hover:bg-[#0F332D]'
            } transition-colors`}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    page === pageNum
                      ? 'bg-[#63B23D] text-white'
                      : 'hover:bg-[#f0f7f5]'
                  } transition-colors`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && page < totalPages - 2 && (
              <span className="px-2">...</span>
            )}
            {totalPages > 5 && page < totalPages - 2 && (
              <button
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#f0f7f5] transition-colors"
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
          </div>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#174940] text-white hover:bg-[#0F332D]'
            } transition-colors`}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {confirming && (
          <Dialog
            open={!!confirming}
            onClose={() => (deleting ? null : setConfirming(null))}
            className="relative z-50"
          >
            {/* Backdrop animado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Contenedor del modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    Confirmar eliminación
                  </Dialog.Title>
                  <button
                    onClick={() => setConfirming(null)}
                    disabled={deleting}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors disabled:opacity-50"
                    aria-label="Cerrar"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-3">
                  <p className="text-gray-700">
                    ¿Seguro que deseas eliminar este registro
                    {confirming && (
                      <>
                        :{' '}
                        <span className="font-semibold">
                          {getDeleteLabel?.(confirming.row) ?? confirming.id}
                        </span>
                      </>
                    )}
                    ?
                  </p>
                  <p className="text-sm text-gray-500">
                    Esta acción <span className="font-semibold">no se puede deshacer</span>.
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    disabled={deleting}
                    className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      deleting
                        ? 'bg-red-400 cursor-not-allowed text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    }`}
                  >
                    {deleting ? 'Eliminando…' : 'Sí, eliminar'}
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
