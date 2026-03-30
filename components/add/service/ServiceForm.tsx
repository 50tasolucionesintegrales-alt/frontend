'use client'

import { useActionState, useEffect, useState } from 'react'
import AddServiceAction from '@/actions/add/services/AddServiceAction'
import { toast } from 'react-toastify'

export default function ServiceForm() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('')
  const [state, dispatch, isPending] = useActionState(AddServiceAction, {
    errors: [],
    success: '',
  })

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((e: string) => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
      setNombre('')
      setDescripcion('')
      setPrecioBase('')
    }
  }, [state])

  return (
    <div className="w-full">
      <form action={dispatch} className="w-full space-y-8 bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-[#174940]">Registrar Nuevo Servicio</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresa la información del servicio que deseas ofrecer</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#174940] mb-2">
              Nombre del Servicio <span className="text-red-500">*</span>
            </label>
            <input
              placeholder='Ej: Desarrollo Web, Consultoría, Mantenimiento...'
              title='nombre'
              name="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#174940] mb-2">
              Descripción
            </label>
            <textarea
              placeholder='Describe en detalle el servicio que ofreces...'
              title='descripcion'
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">Máximo 500 caracteres. Puedes incluir detalles como alcance, entregables, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#174940] mb-2">
              Precio Base <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">$</span>
              <input
                placeholder='0.00'
                title='precioBase'
                name="precioBase"
                type="number"
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all text-base"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Precio por unidad de servicio (en pesos mexicanos)</p>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-[#63B23D] text-white rounded-lg text-base font-medium hover:bg-[#529e33] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando servicio...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guardar Servicio
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}