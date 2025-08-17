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
    <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#174940] mb-1">
            Nombre del Servicio
          </label>
          <input
            name="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#174940] mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#174940] mb-1">
            Precio Base
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              name="precioBase"
              type="number"
              value={precioBase}
              onChange={(e) => setPrecioBase(e.target.value)}
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-[#63B23D] text-white rounded-lg text-sm font-medium hover:bg-[#529e33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Guardar Servicio
            </>
          )}
        </button>
      </div>
    </form>
  )
}