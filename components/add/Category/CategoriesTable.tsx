// components/admin/categories/CategoryTable.tsx
'use client'

import { useEffect, useState } from 'react'
import CrudTable, { Column } from '../crudTable'
import { toast } from 'react-toastify'
import EditCategoryModal from '@/components/modals/categories/EditModal'
// actions los creas tú:
import DeleteCategoryAction from '@/actions/add/categories/DeleteCategoryAction'
import { Categoria } from '@/src/schemas' // id, nombre, descripcion

export default function CategoryTable({ categorias: initial }: { categorias: Categoria[] }) {
  const [items, setItems] = useState<Categoria[]>(initial)
  const [editing, setEditing] = useState<Categoria | null>(null)

  const prev = {
    errors: [],
    success: ''
  }

  useEffect(() => { setItems(initial) }, [initial])

  const columns: Column<Categoria>[] = [
    { header: 'Nombre', render: c => c.nombre },
    { header: 'Descripción', render: c => c.descripcion ?? '—' },
  ]

  const searchable = (c: Categoria, q: string) =>
    c.nombre.toLowerCase().includes(q) ||
    (c.descripcion ?? '').toLowerCase().includes(q)

  const onDelete = async (id: string) => {
    const res = await DeleteCategoryAction(prev, id)
    if (res.errors) { toast.error(res.errors); return }
    setItems(prev => prev.filter(x => x.id !== id))
    toast.success('Categoría eliminada')
  }

  const onEdited = (updated: Categoria) => {
    setItems(prev => prev.map(x => x.id === updated.id ? updated : x))
    setEditing(null)
  }

  return (
    <>
      <CrudTable
        title="Categorías"
        items={items}
        columns={columns}
        getRowId={(c) => c.id}
        onEdit={(row) => setEditing(row)}
        onDelete={onDelete}
        searchable={searchable}
      />
      {editing && (
        <EditCategoryModal
          open
          onClose={() => setEditing(null)}
          categoria={editing}
          onEdited={onEdited}
        />
      )}
    </>
  )
}
