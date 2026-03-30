"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import ExcelStep1Modal from "@/components/modals/quotes/ExcelStep1Modal";
import ExcelStep2Modal from "@/components/modals/quotes/ExcelStep2Modal";
import PdfDownloadModal from "@/components/modals/quotes/PDFDownloadModal";

type Step = "closed" | "step1" | "step2" | "pdf";

export default function ExcelQuoteFlow() {
  const [step, setStep] = useState<Step>("closed");
  const [empresaIds, setEmpresaIds] = useState<number[]>([]);
  const [tipo, setTipo] = useState<"productos" | "servicios">("productos");
  const [quoteId, setQuoteId] = useState<string>("");
  const [pdfEmpresa, setPdfEmpresa] = useState<number>(0);
  const [pdfQueue, setPdfQueue] = useState<number[]>([]);

  const handleStep1Next = (
    ids: number[],
    tipoSeleccionado: "productos" | "servicios",
  ) => {
    setEmpresaIds(ids);
    setTipo(tipoSeleccionado);
    setStep("step2");
  };

  const handleStep2Success = (newQuoteId: string, empresas: number[]) => {
    setQuoteId(newQuoteId);
    setEmpresaIds(empresas);

    localStorage.setItem(`quote:${newQuoteId}:formats`, JSON.stringify(empresas));

    const [first, ...rest] = empresas;
    setPdfEmpresa(first);
    setPdfQueue(rest);
    setStep("pdf");
  };

  const handlePdfClose = () => {
    if (pdfQueue.length > 0) {
      const [next, ...rest] = pdfQueue;
      setPdfEmpresa(next);
      setPdfQueue(rest);
    } else {
      setStep("closed");
      setQuoteId("");
      setEmpresaIds([]);
      setPdfQueue([]);
    }
  };

  return (
    <>
      <button
        onClick={() => setStep("step1")}
        className="flex items-center gap-2 px-4 py-2 rounded-sm border border-[#174940] text-[#174940] hover:bg-[#f0f7f5] transition-colors font-medium text-sm"
      >
        <FileSpreadsheet size={16} />
        Cotización desde Excel
      </button>

      <ExcelStep1Modal
        open={step === "step1"}
        onClose={() => setStep("closed")}
        onNext={handleStep1Next}
      />

      <ExcelStep2Modal
        open={step === "step2"}
        onClose={() => setStep("closed")}
        onBack={() => setStep("step1")}
        empresaIds={empresaIds}
        tipo={tipo}
        onSuccess={handleStep2Success}
      />

      {step === "pdf" && quoteId && pdfEmpresa > 0 && (
        <PdfDownloadModal
          open={true}
          onClose={handlePdfClose}
          quoteId={quoteId}
          empresa={pdfEmpresa}
        />
      )}
    </>
  );
}
