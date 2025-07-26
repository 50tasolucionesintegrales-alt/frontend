"use client"

import React, { useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { forgotPassword } from '@/actions/auth/frogotPasswordAction'
import { Mail } from 'lucide-react';

export default function ForgotPassForm() {
  const [state, dispatch] = useActionState(forgotPassword, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach(error => {
        toast.error(error)
      })
    }

    if (state.success) {
      toast.success(state.success)
    }
  }, [state])

  return (
    <form action={dispatch} className="space-y-6" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Correo Electrónico
        </label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@correo.com"
            className="w-full text-black pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#63B23D] focus:outline-none text-sm"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-[#63B23D] text-white rounded-md hover:bg-[#4D9A2E] transition-colors font-medium"
      >
        Enviar enlace de recuperación
      </button>
    </form>
  )
}