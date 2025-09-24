import { getProductImageDataUrl } from "@/actions/add/products/ProductImageAction";
import Catalogo from "@/components/catalog/Catalogo";
import { cookies } from "next/headers";
import { Box } from "lucide-react";

export default async function CatalogPage() {
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

  const resProd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

  const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header con título, icono y descripción */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Box className="h-8 w-8 text-[#63B23D]" />
            <div>
              <h1 className="text-3xl font-bold text-[#174940]">Catálogo de Productos y Servicios</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Explora todas las categorías, productos y servicios disponibles.
              </p>
            </div>
          </div>
        </header>

        {/* Componente principal */}
        <Catalogo 
          categorias={resCat} 
          productos={resProd} 
          servicios={services} 
          getImageDataUrl={getProductImageDataUrl} 
        />
      </div>
    </div>
  );
}