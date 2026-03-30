'use client'

import { useEffect, useState } from 'react'
import CrudTable, { Column } from '../crudTable'
import { toast } from 'react-toastify'
import EditServiceModal from '@/components/modals/service/EditarModal'
import DeleteServiceAction from '@/actions/add/services/DeleteServiceAction'
import { Service } from '@/src/schemas'

// Función de formato de moneda
const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return '$0.00'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

export default function ServiceTable({ services }: { services: Service[] }) {
  const [items, setItems] = useState<Service[]>(services)
  const [editing, setEditing] = useState<Service | null>(null)

  const prev = {
    errors: [],
    success: ''
  }

  useEffect(() => { setItems(services) }, [services])

  const columns: Column<Service>[] = [
    { 
      header: 'Nombre', 
      render: s => s.nombre,
      width: '200px',
    },
    { 
      header: 'Descripción', 
      render: s => s.descripcion ?? '—',
      width: '500px',
      maxLines: 5,
      className: 'break-words',
    },
    { 
      header: 'Precio base', 
      render: s => formatCurrency(s.precioBase), // <-- Aquí se aplica el formato
      width: '140px',
      className: 'text-right font-medium',
    },
  ]

  const searchable = (s: Service, q: string) =>
    s.nombre.toLowerCase().includes(q) ||
    (s.descripcion ?? '').toLowerCase().includes(q)

  const onDelete = async (id: string) => {
    const res = await DeleteServiceAction(prev, id)
    if (res.errors) { toast.error(res.errors); return }
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