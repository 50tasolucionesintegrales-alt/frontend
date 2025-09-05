'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react'

import EditProductModal from '@/components/modals/products/editProductModal'
import DeleteProductAction from '@/actions/add/products/DeleteProductAction'
import { Categoria, Producto } from '@/src/schemas'

import ProductImage from './ProductImage'
import ConfirmDialog from './confirmDialog'

type Props = {
  products: Producto[]
  categorias: Categoria[]
  getProductImageDataUrl: (id: string) => Promise<string | null>
}

export default function ProductTable({ products, categorias, getProductImageDataUrl }: Props) {
  const [items, setItems] = useState<Producto[]>(products)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [editing, setEditing] = useState<Producto | null>(null)

  // Confirmación
  const [confirming, setConfirming] = useState<Producto | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setItems(products)
  }, [products])

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase()
    return items.filter(p => {
      const matchesQ = qLower ? p.nombre.toLowerCase().includes(qLower) : true
      const pCatId = (p as any).categoryId ?? p.category?.id
      const matchesCat = cat ? pCatId === cat : true
      return matchesQ && matchesCat
    })
  }, [items, q, cat])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    const slice = filtered.slice(start, start + pageSize)
    if (slice.length === 0 && page > 1) setPage(p => Math.max(1, p - 1))
    return slice
  }, [filtered, page])

  const doDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await DeleteProductAction(id)
      if (res?.error) {
        toast.error(res.error)
        return
      }
      setItems(prev => prev.filter(p => p.id !== id))
      toast.success('Producto eliminado')
    } catch {
      toast.error('No se pudo eliminar el producto')
    } finally {
      setDeleting(false)
      setConfirming(null)
    }
  }

  const handleEdited = (updated: Producto) => {
    setItems(prev => prev.map(p => (p.id === updated.id ? updated : p)))
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#999999]" />
          </div>
          <input
            placeholder="Buscar productos..."
            className="pl-10 pr-4 py-2 w-full border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
          />
        </div>
        
        <select
          className="w-full sm:w-64 px-4 py-2 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
          value={cat}
          onChange={(e) => { setCat(e.target.value); setPage(1) }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-[#174940]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e5e7eb]">
            {paged.map(p => (
              <tr key={p.id} className="hover:bg-[#f0f7f5] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ProductImage
                        productId={p.id}
                        productName={p.nombre}
                        getProductImageDataUrl={getProductImageDataUrl}
                        className="h-10 w-10"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-[#0F332D]">{p.nombre}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#174940] font-medium">
                  ${parseFloat(p.precio.toString()).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#174940]">
                  {p.category?.nombre ??
                    categorias.find(c => c.id === ((p as any).categoryId ?? p.category?.id))?.nombre ??
                    '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setEditing(p)}
                      className="text-[#174940] hover:text-[#0F332D] flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => setConfirming(p)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td className="px-6 py-12 text-center text-[#999999]" colSpan={4}>
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 mb-2 text-[#e5e7eb]" />
                    <p className="text-lg font-medium text-[#174940]">
                      No se encontraron productos
                    </p>
                    {q && <p className="mt-1">Intenta con otro término de búsqueda</p>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-[#999999]">
          Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} de {filtered.length} productos
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#174940] text-white hover:bg-[#0F332D]'
            } transition-colors`}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) pageNum = i + 1
              else if (page <= 3) pageNum = i + 1
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
              else pageNum = page - 2 + i

              return (
                <button
                  key={pageNum}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    page === pageNum ? 'bg-[#63B23D] text-white' : 'hover:bg-[#f0f7f5]'
                  } transition-colors`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && page < totalPages - 2 && <span className="px-2">...</span>}
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
              page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#174940] text-white hover:bg-[#0F332D]'
            } transition-colors`}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal edición */}
      {editing && (
        <EditProductModal
          open={true}
          onClose={() => setEditing(null)}
          producto={editing}
          categorias={categorias}
          onEdited={handleEdited}
        />
      )}

      {/* Modal confirmación (reutilizable) */}
      <ConfirmDialog
        open={!!confirming}
        title="Confirmar eliminación"
        description={
          confirming
            ? <>¿Seguro que deseas eliminar el producto <span className="font-semibold">{confirming.nombre}</span>?</>
            : null
        }
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        loading={deleting}
        onClose={() => setConfirming(null)}
        onConfirm={() => confirming && doDelete(confirming.id)}
      />
    </div>
  )
}
