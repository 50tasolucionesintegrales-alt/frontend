"use client";

import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  importExcelAction,
  ImportExcelResult,
} from "@/actions/quotes/importExcelAction";

type Props = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  empresaIds: number[];
  tipo: "productos" | "servicios";
  onSuccess: (quoteId: string, empresas: number[]) => void;
};

type RowError = { fila: number; campo: string; mensaje: string };

export default function ExcelStep2Modal({
  open,
  onClose,
  onBack,
  empresaIds,
  tipo,
  onSuccess,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);

  const handleFile = (f: File) => {
    setRowErrors([]);
    if (!f.name.endsWith(".xlsx")) {
      toast.error("Solo se aceptan archivos .xlsx");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleBack = () => {
    setFile(null);
    setRowErrors([]);
    onBack();
  };

  const handleProcess = async () => {
    if (!file) {
      toast.warn("Selecciona un archivo primero");
      return;
    }

    setLoading(true);
    setRowErrors([]);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("empresas", JSON.stringify(empresaIds));
      fd.append("tipo", tipo);

      const result: ImportExcelResult = await importExcelAction(fd);

      if (!result.ok) {
        if ("errors" in result && result.errors?.length) {
          setRowErrors(result.errors);
          toast.error(
            `El archivo tiene ${result.errors.length} error(es). Corrígelos y vuelve a subir.`,
          );
        } else {
          toast.error(result.error ?? "Error al procesar el archivo");
        }
        return;
      }

      // Mostrar advertencias si hay
      if (result.advertencias?.length) {
        const reutilizados = result.advertencias.filter(a => 
          a.includes('ya existía')
        ).length;
        
        if (reutilizados > 0) {
          toast.info(
            `${reutilizados} producto(s) ya existían y fueron reutilizados.`,
            { autoClose: 6000 }
          );
        }

        const otrasAdvertencias = result.advertencias.filter(a => 
          !a.includes('ya existía')
        );
        otrasAdvertencias.forEach(adv => toast.warn(adv, { autoClose: 6000 }));
      }
      toast.success(
        `Cotización creada: ${result.productosCreados} producto(s) nuevo(s), ${result.productosReutilizados} reutilizado(s)`,
      );

      onSuccess(result.quoteId, result.empresas);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setRowErrors([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={handleClose} className="relative z-50">
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
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl mx-2 max-h-[85vh] overflow-y-auto"
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
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-5">
                Paso 2 de 2 — Sube el Excel con los productos y márgenes
              </p>

              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${
                    dragging
                      ? "border-[#63B23D] bg-[#f0f7f5]"
                      : file
                        ? "border-[#63B23D] bg-[#f0f7f5]"
                        : "border-gray-300 hover:border-[#174940] hover:bg-gray-50"
                  }
                `}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="text-[#63B23D]" size={36} />
                    <p className="font-medium text-[#0F332D]">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB — Haz clic para cambiar
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-gray-400" size={36} />
                    <p className="font-medium text-gray-700">
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-400">
                      Solo archivos .xlsx — máx. 10 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Organizaciones seleccionadas */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 self-center">
                  Organizaciones:
                </span>
                {empresaIds.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-1 text-xs rounded-full bg-[#174940] text-white font-medium"
                  >
                    {EMPRESA_LABELS[id] ?? `Org ${id}`}
                  </span>
                ))}
              </div>

              {/* Tabla de errores de validación */}
              {rowErrors.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-red-500" size={16} />
                    <p className="text-sm font-medium text-red-600">
                      {rowErrors.length} error(es) encontrados — corrige el
                      Excel y vuelve a subirlo
                    </p>
                  </div>
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-red-50 text-red-700">
                        <tr>
                          <th className="py-2 px-3 text-left font-medium">
                            Fila
                          </th>
                          <th className="py-2 px-3 text-left font-medium">
                            Campo
                          </th>
                          <th className="py-2 px-3 text-left font-medium">
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-100">
                        {rowErrors.map((err, i) => (
                          <tr key={i} className="bg-white">
                            <td className="py-2 px-3 text-gray-700">
                              {err.fila}
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {err.campo}
                            </td>
                            <td className="py-2 px-3 text-red-600">
                              {err.mensaje}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleProcess}
                    disabled={loading || !file}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-[#174940] text-white hover:bg-[#0F332D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Procesar Excel
                      </>
                    )}
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

// Labels para mostrar las organizaciones seleccionadas
const EMPRESA_LABELS: Record<number, string> = {
  1: "Goltech",
  2: "Juan Á.",
  3: "Alejandra G.",
  4: "Adrián O.",
  5: "Mariana L.",
  6: "Michelle",
  7: "Chalor",
  8: "Leyses",
  9: "Eduardo S.",
  10: "Jessica R.",
  11: "Grupo Álamo",
  12: "Hugo R.",
};
