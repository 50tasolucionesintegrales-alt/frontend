'use client'

import { useState } from 'react'
import { Button } from '../ui/boton'
import AddCategoryModal from './Category/AddCategoryModal'
import ServiceForm from './service/ServiceForm'
import ProductForm from './product/ProductForm'
import { Categoria } from '@/src/schemas'

type Props = {
    categorias: Categoria[]
}

type Mode = 'producto' | 'servicio'

export default function ProductServiceManager({categorias} : Props) {
  const [mode, setMode] = useState<Mode>('producto')
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header con volver y nueva categoría */}
      <div className="flex justify-between items-center mb-8">
        {mode === 'producto' ? (
          <h1 className='text-2xl text-[#174940]'>Agregar Producto</h1>
        ) : (
          <h1 className='text-2xl text-[#174940]'>Agregar Servicio</h1>
        )}
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#63B23D] hover:bg-[#529e33] text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva Categoría
        </Button>
      </div> 

      {/* Tabs de selección */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setMode('producto')}
          className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
            mode === 'producto' 
              ? 'bg-[#174940] text-white' 
              : 'text-[#174940] hover:bg-[#f0f7f5]'
          }`}
        >
          Productos
        </button>
        <button
          onClick={() => setMode('servicio')}
          className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
            mode === 'servicio' 
              ? 'bg-[#174940] text-white' 
              : 'text-[#174940] hover:bg-[#f0f7f5]'
          }`}
        >
          Servicios
        </button>
      </div>

      {/* Formulario activo */}
      <div className="mt-0">
        {mode === 'producto' ? (
          <div className="border border-t-0 border-gray-200 p-6 rounded-b-lg rounded-tr-lg shadow-sm bg-white">
            <ProductForm categorias={categorias} />
          </div>
        ) : (
          <div className="border border-t-0 border-gray-200 p-6 rounded-b-lg rounded-tr-lg shadow-sm bg-white">
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