"use client";

import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormatsPicker } from "@/components/quotes/FormatsPicker";
import { useSelectedFormats } from "@/components/quotes/hooks/useSelectedFormats";
import { downloadExcelTemplateAction } from "@/actions/quotes/downloadExcelTemplateAction";

type Props = {
  open: boolean;
  onClose: () => void;
  onNext: (empresaIds: number[]) => void;
};

export default function ExcelStep1Modal({ open, onClose, onNext }: Props) {
  const { selected, toggle, selectAll, clearAll, hydrated } =
    useSelectedFormats("excel:step1:formats", [1]);
  const [downloading, setDownloading] = useState(false);
  const [numProductos, setNumProductos] = useState(10);

  const handleDownload = async () => {
    if (!selected.length) {
      toast.warn("Selecciona al menos una organización");
      return;
    }
    setDownloading(true);
    try {
      const result = await downloadExcelTemplateAction(selected, numProductos);
      if (result.error || !result.buffer) {
        toast.error(result.error ?? "Error al generar la plantilla");
        return;
      }
      const bytes = Uint8Array.from(atob(result.buffer), (c) =>
        c.charCodeAt(0),
      );
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename ?? "cotizacion_plantilla.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Plantilla descargada");
    } finally {
      setDownloading(false);
    }
  };

  const handleNext = () => {
    if (!selected.length) {
      toast.warn("Selecciona al menos una organización");
      return;
    }
    onNext(selected);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl mx-2"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="text-[#63B23D]" size={22} />
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    Cotización desde Excel
                  </Dialog.Title>
                </div>
                <button
                  title="cerrar"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-5">
                Paso 1 de 2 — Selecciona las organizaciones y descarga la plantilla
              </p>

              <FormatsPicker
                selected={selected}
                toggle={toggle}
                selectAll={selectAll}
                clearAll={clearAll}
                hydrated={hydrated}
                disabled={downloading}
              />

              {/* Selector de cantidad de productos */}
              <div className="mt-4 p-4 bg-[#f0f7f5] rounded-lg">
                <label className="block text-sm font-medium text-[#0F332D] mb-2">
                  ¿Cuántos productos vas a cotizar?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={numProductos}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v >= 1 && v <= 200) setNumProductos(v);
                    }}
                    className="w-24 px-3 py-2 rounded-lg border border-[#174940] text-[#174940] font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#174940]"
                  />
                  <span className="text-sm text-gray-500">
                    productos (máx. 200)
                  </span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[5, 10, 15, 20, 30, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumProductos(n)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        numProductos === n
                          ? "bg-[#174940] text-white"
                          : "bg-white border border-[#174940] text-[#174940] hover:bg-[#f0f7f5]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instrucciones */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">¿Cómo funciona?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Selecciona las organizaciones que quieres cotizar.</li>
                  <li>Elige cuántos productos necesitas.</li>
                  <li>Descarga la plantilla Excel con esas filas listas.</li>
                  <li>Llena los datos y sube el archivo en el siguiente paso.</li>
                </ol>
              </div>

              {/* Botones */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading || !selected.length}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#174940] text-[#174940] hover:bg-[#f0f7f5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  {downloading ? "Descargando..." : "Descargar plantilla"}
                </button>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selected.length}
                    className="px-6 py-2.5 rounded-lg font-medium bg-[#174940] text-white hover:bg-[#0F332D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}