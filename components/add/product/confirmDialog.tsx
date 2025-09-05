'use client'

import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Confirmar',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={() => (loading ? null : onClose())}
          className="relative z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
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
                  {title}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors disabled:opacity-50"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-gray-700">{description}</div>
                <p className="text-sm text-gray-500">
                  Esta acción <span className="font-semibold">no se puede deshacer</span>.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    loading
                      ? 'bg-red-400 cursor-not-allowed text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                  }`}
                >
                  {loading ? 'Procesando…' : confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
