import QuoteDetailSkeleton from '@/components/quotes/QuoteDetailSkeleton';

export default function Loading() {
  // Aquí puedes replicar el layout de tu página, pero usando "skeletons"
  return (
    <div className="p-6">
      {/* Esqueleto del Header (Título y Botón Volver) */}
      <div className="flex items-center justify-between mb-6 gap-3">
        {/* Caja gris para el título */}
        <div className="h-9 w-1/2 rounded bg-gray-200 animate-pulse"></div>
        {/* Caja gris para el botón */}
        <div className="h-10 w-24 rounded-lg bg-gray-200 animate-pulse"></div>
      </div>

      {/* Esqueleto del botón "AddItemsModal" */}
      <div className="h-10 w-40 rounded-lg bg-gray-200 animate-pulse mb-6"></div>

      {/* Esqueleto de la tabla de detalles */}
      <QuoteDetailSkeleton />
    </div>
  );
}