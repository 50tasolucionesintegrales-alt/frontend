// components/quotes/PdfDownloadModal.tsx
'use client'

import { Dialog } from '@headlessui/react'
import { useActionState, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadQuotePdfAction } from '@/actions/quotes/GetQuotePdfAction'
import { Loader2, Download, X } from 'lucide-react'
import { toast } from 'react-toastify'

export default function PdfDownloadModal({
  open,
  onClose,
  quoteId,
  empresa,
}: {
  open: boolean
  onClose: () => void
  quoteId: string
  empresa: number
}) {
  const today  = new Date().toISOString().slice(0, 10)
  const LS_KEY = `quote:${quoteId}:pdfForm:${empresa}`

  const [destinatario, setDestinatario] = useState('')
  const [descripcion, setDescripcion]   = useState('')
  const [fecha, setFecha]               = useState(today)

  const [state, formAction, pending] = useActionState(downloadQuotePdfAction, {})

  // ------- helpers -------
  const resetForm = () => {
    setDestinatario('')
    setDescripcion('')
    setFecha(today)
    try { localStorage.removeItem(LS_KEY) } catch {}
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Cargar defaults guardados por formato (si existen)
  useEffect(() => {
    if (!open) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const j = JSON.parse(raw)
        setDestinatario(j.destinatario ?? '')
        setDescripcion(j.descripcion ?? '')
        setFecha(j.fecha ?? today)
      } else {
        resetForm()
      }
    } catch {
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, LS_KEY])

  // Al recibir el PDF -> descargar y cerrar + reset
  useEffect(() => {
    if (state?.dataUrl) {
      const a = document.createElement('a')
      a.href = state.dataUrl
      a.download = state.filename || `quote_${quoteId}_m${empresa}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('PDF generado')

      // Si prefieres conservar los últimos datos usados, comenta la línea de reset
      resetForm()
      handleClose()
    } else if (state?.error) {
      toast.error(state.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={handleClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2"
            >
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Descargar PDF — Formato {empresa}
                </Dialog.Title>
                <button onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form
                action={(fd) => {
                  fd.append('quoteId', quoteId)
                  fd.append('empresa', String(empresa))
                  fd.append('destinatario', destinatario)
                  fd.append('descripcion', descripcion)
                  fd.append('fecha', fecha)
                  return formAction(fd)
                }}
                className="space-y-5"
              >
                <div className="text-sm">
                  <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium">
                    Empresa / Formato: {empresa}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatario <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Texto que aparecerá en el PDF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                  <button type="button" onClick={handleClose} disabled={pending}
                    className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={pending}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      pending ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    }`}>
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {pending ? 'Generando…' : 'Generar PDF'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
