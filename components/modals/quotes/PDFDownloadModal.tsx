// components/quotes/PdfDownloadModal.tsx
'use client'

import { Dialog } from '@headlessui/react'
import { useActionState, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadQuotePdfAction } from '@/actions/quotes/GetQuotePdfAction'
import { Loader2, Download, X, Plus, Trash2, List, Text } from 'lucide-react'
import { toast } from 'react-toastify'

type Persisted = {
  destinatario?: string
  presente?: string
  descripcion?: string
  folio?: string
  lugar?: string
  fecha?: string
  incluirFirma?: boolean
  // constructor de condiciones
  condicionesItems?: string[]
  condicionesText?: string
  condicionesMode?: 'list' | 'text'
}

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
  const today = new Date().toISOString().slice(0, 10)
  const LS_KEY = useMemo(() => `quote:${quoteId}:pdfForm:${empresa}`, [quoteId, empresa])

  // ---- Campos generales
  const [destinatario, setDestinatario] = useState('')
  const [presente, setPresente] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [folio, setFolio] = useState('')
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState(today)
  const [incluirFirma, setIncluirFirma] = useState(false)

  // ---- Condiciones (constructor)
  const [condicionesItems, setCondicionesItems] = useState<string[]>([])
  const [condicionesText, setCondicionesText] = useState('')
  const [condicionesMode, setCondicionesMode] = useState<'list' | 'text'>('list')

  const [state, formAction, pending] = useActionState(downloadQuotePdfAction, {})

  // Validación mínima
  const isValid = destinatario.trim().length > 0 && fecha.trim().length > 0

  // Helpers para condiciones
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const fromTextToItems = (text: string) =>
    text
      .split(/\r?\n|;/)
      .map((s) => s.trim())
      .filter(Boolean)

  const buildCondHtml = (items: string[]) =>
    `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`

  const importFromTextarea = () => {
    const items = fromTextToItems(condicionesText)
    if (items.length) {
      setCondicionesItems(items)
      setCondicionesMode('list')
      toast.info('Condiciones importadas como lista')
    } else {
      toast.warn('No encontré líneas para importar')
    }
  }

  // Reset
  const resetForm = () => {
    setDestinatario('')
    setPresente('')
    setDescripcion('')
    setFolio('')
    setLugar('')
    setFecha(today)
    setIncluirFirma(false)
    setCondicionesItems([])
    setCondicionesText('')
    setCondicionesMode('list')
    try { localStorage.removeItem(LS_KEY) } catch {}
  }
  const handleClose = () => { resetForm(); onClose() }

  // Cargar guardado
  useEffect(() => {
    if (!open) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const j: Persisted = JSON.parse(raw)
        setDestinatario(j.destinatario ?? '')
        setPresente(j.presente ?? '')
        setDescripcion(j.descripcion ?? '')
        setFolio(j.folio ?? '')
        setLugar(j.lugar ?? '')
        setFecha(j.fecha ?? today)
        setIncluirFirma(!!j.incluirFirma)
        setCondicionesItems(j.condicionesItems ?? [])
        setCondicionesText(j.condicionesText ?? '')
        setCondicionesMode(j.condicionesMode ?? 'list')
      } else {
        resetForm()
      }
    } catch { resetForm() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, LS_KEY])

  // Guardar cambios
  useEffect(() => {
    if (!open) return
    const payload: Persisted = {
      destinatario, presente, descripcion, folio, lugar, fecha, incluirFirma,
      condicionesItems, condicionesText, condicionesMode,
    }
    try { localStorage.setItem(LS_KEY, JSON.stringify(payload)) } catch {}
  }, [open, LS_KEY, destinatario, presente, descripcion, folio, lugar, fecha, incluirFirma, condicionesItems, condicionesText, condicionesMode])

  // Respuesta del action
  useEffect(() => {
    if (state?.dataUrl) {
      const a = document.createElement('a')
      a.href = state.dataUrl
      a.download = state.filename || `quote_${quoteId}_m${empresa}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
      toast.success('PDF generado')
      resetForm(); handleClose()
    } else if (state?.error) {
      toast.error(state.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // ---- UI
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
              className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl mx-2"
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

              <p className="text-xs text-gray-600 mb-4">
                Algunos campos no aparecen en ciertos formatos, pero se envían para mantener la compatibilidad entre plantillas.
              </p>

              <form
                action={(fd) => {
                  // Construye el HTML de condiciones en el submit
                  const items =
                    condicionesItems.length
                      ? condicionesItems
                      : fromTextToItems(condicionesText)

                  const condicionesHtml = items.length ? buildCondHtml(items) : ''

                  fd.append('quoteId', quoteId)
                  fd.append('empresa', String(empresa))
                  fd.append('destinatario', destinatario)
                  fd.append('presente', presente)
                  fd.append('descripcion', descripcion)
                  fd.append('folio', folio)
                  fd.append('lugar', lugar)
                  fd.append('fecha', fecha)
                  fd.append('incluirFirma', incluirFirma ? 'true' : 'false')
                  fd.append('condiciones', condicionesHtml) // 👈 ya en <ul><li>…</li></ul>

                  return formAction(fd)
                }}
                className="space-y-6"
              >
                {/* Datos generales */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario *</label>
                    <input
                      value={destinatario}
                      onChange={(e) => setDestinatario(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Nombre del cliente o dependencia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">“Presente” / Encabezado</label>
                    <input
                      value={presente}
                      onChange={(e) => setPresente(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Ej. A QUIEN CORRESPONDA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                    <input
                      value={lugar}
                      onChange={(e) => setLugar(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Ciudad, Estado"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folio</label>
                    <input
                      value={folio}
                      onChange={(e) => setFolio(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="COT-2025-0001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Cuerpo</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Texto que aparecerá en el PDF"
                  />
                </div>

                {/* ====== Constructor de condiciones ====== */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Condiciones / Términos</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCondicionesMode('list')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                          condicionesMode === 'list'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        title="Constructor de lista"
                      >
                        <List size={16}/> Lista
                      </button>
                      <button
                        type="button"
                        onClick={() => setCondicionesMode('text')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                          condicionesMode === 'text'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        title="Pegar texto y convertir"
                      >
                        <Text size={16}/> Texto
                      </button>
                    </div>
                  </div>

                  {condicionesMode === 'list' ? (
                    <div className="rounded-lg border border-gray-200 p-3 space-y-3">
                      {condicionesItems.length === 0 && (
                        <p className="text-xs text-gray-500">Sin ítems. Agrega condiciones con el botón de abajo.</p>
                      )}

                      {condicionesItems.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            value={it}
                            onChange={(e) => {
                              const arr = [...condicionesItems]
                              arr[idx] = e.target.value
                              setCondicionesItems(arr)
                            }}
                            placeholder={`Condición #${idx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => setCondicionesItems(condicionesItems.filter((_, i) => i !== idx))}
                            className="p-2 rounded-md text-red-600 hover:bg-red-50"
                            aria-label="Eliminar condición"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCondicionesItems([...condicionesItems, ''])}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                        >
                          <Plus size={16}/> Agregar condición
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCondicionesItems(['Precios en MXN','Entrega: 7 días','Garantía: 12 meses'])
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                        >
                          Usar ejemplo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 p-3 space-y-2">
                      <textarea
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        value={condicionesText}
                        onChange={(e) => setCondicionesText(e.target.value)}
                        placeholder={`Pega cada condición en una línea (o sepáralas con ';')\nEj:\nPrecios en MXN\nEntrega: 7 días\nGarantía: 12 meses`}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={importFromTextarea}
                          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                        >
                          Importar como lista
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="incluirFirma"
                    type="checkbox"
                    checked={incluirFirma}
                    onChange={(e) => setIncluirFirma(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-[#63B23D] focus:ring-[#57a533]"
                  />
                  <label htmlFor="incluirFirma" className="text-sm font-medium text-gray-700">
                    Incluir firma
                  </label>
                </div>

                {/* Botones */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={pending}
                    className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={pending || !isValid}
                    aria-disabled={pending || !isValid}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      pending || !isValid
                        ? 'bg-green-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    }`}
                  >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {pending ? 'Generando…' : 'Generar PDF'}
                  </button>
                </div>

                {!isValid && (
                  <p className="text-xs text-red-600 mt-2">
                    Completa los campos obligatorios: <b>Destinatario</b> y <b>Fecha</b>.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}