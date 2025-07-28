'use client'

import { useState } from 'react'
import { Button } from '../ui/boton'
import AddCategoryModal from './Category/AddCategoryModal'
import ServiceForm from './ServiceForm'
import ProductForm from './ProductForm'
import { Categoria } from '@/src/schemas'

type Props = {
    categorias: Categoria[]
}

type Mode = 'producto' | 'servicio'

export default function ProductServiceManager({categorias} : Props) {
  const [mode, setMode] = useState<Mode>('producto')
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header con volver y nueva categoría */}
      <div className="flex justify-between items-center">
        <button onClick={() => window.history.back()}>
          ← Volver
        </button>
        <button onClick={() => setOpen(true)}>
          + Nueva Categoría
        </button>
      </div>

      {/* Tabs de selección */}
      <div className="flex space-x-4">
        <button
          onClick={() => setMode('producto')}
        >
          Productos
        </button>
        <button
          onClick={() => setMode('servicio')}
        >
          Servicios
        </button>
      </div>

      {/* Formulario activo */}
      <div className="mt-6">
        {mode === 'producto' ? (
          <div className="border p-4 rounded-md bg-gray-50">
            {/* Aquí insertaremos el formulario de producto */}
            <ProductForm categorias={categorias} />
          </div>
        ) : (
          <div className="border p-4 rounded-md bg-gray-50">
            {/* Aquí insertaremos el formulario de servicio */}
            <ServiceForm />
          </div>
        )}
      </div>
      {open && (
    <AddCategoryModal open={open} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
