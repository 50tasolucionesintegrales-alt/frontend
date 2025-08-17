// components/admin/services/ServiceTable.tsx
'use client'

import { useEffect, useState } from 'react'
import CrudTable, { Column } from '../crudTable'
import { toast } from 'react-toastify'
import EditServiceModal from '@/components/modals/service/EditarModal'
// actions los creas tú:
import DeleteServiceAction from '@/actions/add/services/DeleteServiceAction'
import { Service } from '@/src/schemas'

export default function ServiceTable({ services }: { services: Service[] }) {
  const [items, setItems] = useState<Service[]>(services)
  const [editing, setEditing] = useState<Service | null>(null)

  const prev = {
    errors: [],
    success: ''
  }

  useEffect(() => { setItems(services) }, [services])

  const columns: Column<Service>[] = [
    { header: 'Nombre', render: s => s.nombre },
    { header: 'Descripción', render: s => s.descripcion ?? '—' },
    { header: 'Precio base', render: s => `$${s.precioBase}` },
  ]

  const searchable = (s: Service, q: string) =>
    s.nombre.toLowerCase().includes(q) ||
    (s.descripcion ?? '').toLowerCase().includes(q)

  const onDelete = async (id: string) => {
    const res = await DeleteServiceAction(prev, id)
    if ((res as any)?.error) { toast.error((res as any).error); return }
    setItems(prev => prev.filter(x => x.id !== id))
    toast.success('Servicio eliminado')
  }

  const onEdited = (updated: Service) => {
    setItems(prev => prev.map(x => x.id === updated.id ? updated : x))
    setEditing(null)
  }

  return (
    <>
      <CrudTable
        title="Servicios"
        items={items}
        columns={columns}
        getRowId={(s) => s.id}
        onEdit={(row) => setEditing(row)}
        onDelete={onDelete}
        searchable={searchable}
      />
      {editing && (
        <EditServiceModal
          open
          onClose={() => setEditing(null)}
          servicio={editing}
          onEdited={onEdited}
        />
      )}
    </>
  )
}
