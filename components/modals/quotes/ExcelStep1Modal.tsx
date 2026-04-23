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
  onNext: (empresaIds: number[], tipo: "productos" | "servicios") => void;
};

export default function ExcelStep1Modal({ open, onClose, onNext }: Props) {
  const { selected, toggle, selectAll, clearAll, hydrated } =
    useSelectedFormats("excel:step1:formats", [1]);
  const [downloading, setDownloading] = useState(false);
  const [numItems, setNumItems] = useState(10);
  const [tipo, setTipo] = useState<"productos" | "servicios">("productos");

  const handleDownload = async () => {
    if (!selected.length) {
      toast.warn("Selecciona al menos una organización");
      return;
    }
    setDownloading(true);
    try {
      const result = await downloadExcelTemplateAction(
        selected,
        numItems,
        tipo,
      );
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
    onNext(selected, tipo);
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
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl mx-2 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
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
              <p className="text-sm text-gray-500 mb-6">
                Paso 1 de 2 — Configura y descarga tu plantilla
              </p>

              {/* Organizaciones */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-[#0F332D] mb-2">
                  1. Selecciona las organizaciones
                </p>
                <FormatsPicker
                  selected={selected}
                  toggle={toggle}
                  selectAll={selectAll}
                  clearAll={clearAll}
                  hydrated={hydrated}
                  disabled={downloading}
                />
              </div>

              <div className="border-t pt-5 mb-5">
                {/* Tipo */}
                <p className="text-sm font-semibold text-[#0F332D] mb-3">
                  2. Tipo de cotización
                </p>
                <div className="flex gap-3">
                  {(["productos", "servicios"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTipo(t)}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        tipo === t
                          ? "bg-[#174940] text-white"
                          : "bg-white border border-[#174940] text-[#174940] hover:bg-[#f0f7f5]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-5 mb-5">
                {/* Cantidad */}
                <p className="text-sm font-semibold text-[#0F332D] mb-3">
                  3. ¿Cuántos {tipo} vas a cotizar?
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={numItems}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v >= 1 && v <= 1000) setNumItems(v);
                    }}
                    className="w-22 px-3 py-2 rounded-lg border border-[#174940] text-[#174940] font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#174940]"
                  />
                  <span className="text-sm text-gray-400">máx. 1000</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[5, 10, 25, 50, 100, 250, 500, 1000].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumItems(n)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        numItems === n
                          ? "bg-[#174940] text-white"
                          : "bg-white border border-[#174940] text-[#174940] hover:bg-[#f0f7f5]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nota */}
              <p className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
                ⚠️ La plantilla solo funcionará con las mismas organizaciones y
                tipo seleccionados. Si cambias algo, descarga una nueva
                plantilla.
              </p>

              {/* Botones */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t">
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
