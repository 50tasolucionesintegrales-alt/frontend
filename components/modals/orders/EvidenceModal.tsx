'use client';

import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

export default function EvidenceModal({
  open,
  onClose,
  src,
  alt = 'Evidencia',
}: {
  open: boolean;
  onClose: () => void;
  src: string | null;
  alt?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-[70]">
          {/* Fondo oscuro con animación */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Contenedor del modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl rounded-xl bg-white shadow-xl overflow-hidden mx-2"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <Dialog.Title className="text-lg font-bold text-gray-900">
                  {alt}
                </Dialog.Title>
                <div className="flex items-center gap-3">
                  {src && (
                    <a
                      href={src}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-green-600 hover:bg-green-50 border border-green-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Contenido de la imagen */}
              <div className="bg-gray-50">
                <div className="max-h-[80vh] flex items-center justify-center p-6">
                  {src ? (
                    <img
                      src={src}
                      alt={alt}
                      className="max-w-full max-h-[75vh] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-500 py-12">Sin evidencia disponible</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
