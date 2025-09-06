'use client';

import { Categoria, Producto, Service } from '@/src/schemas';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import ServiceCard from './ServiceCard'; // 👉 NUEVO

type props = {
  categorias: Categoria[]
  productos: Producto[]
  servicios: Service[]
  getImageDataUrl: (id: string) => Promise<string | null>; // ← action
}

export default function Catalogo({ categorias, productos, servicios, getImageDataUrl }: props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('todos'); // 'todos' será nuestro tab principal
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const LIMITE_PRODUCTOS_SCROLL = 4;

  // Función para filtrar productos según búsqueda y categoría
  const productosFiltrados = (categoriaId: string) => {
    const filteredBySearch = productos.filter(prod =>
      prod.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (categoriaId === 'todos') return filteredBySearch;
    return filteredBySearch.filter(prod => prod.category.id === categoriaId);
  };

  // 👉 NUEVO: filtro de servicios por búsqueda
  const serviciosFiltrados = servicios.filter(svc => {
    const q = searchQuery.toLowerCase();
    return (
      svc.nombre.toLowerCase().includes(q) ||
      svc.descripcion.toLowerCase().includes(q)
    );
  });

  const scrollLeft = (tabId: string) => {
    if (scrollRefs.current[tabId]) {
      scrollRefs.current[tabId].scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (tabId: string) => {
    if (scrollRefs.current[tabId]) {
      scrollRefs.current[tabId].scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-3 mb-8 sticky top-0 bg-white py-4 z-10">
        <div className="relative flex-1 md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search size={18} className="text-[#999999]" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 w-full border border-[#999999]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174940]/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pestañas de categorías */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max pb-2">
          {/* Pestaña "Todos" */}
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'todos'
                ? 'bg-[#174940] text-white shadow-md'
                : 'bg-[#174940]/10 text-[#174940] hover:bg-[#174940]/20'
            }`}
          >
            Todos los productos ({productosFiltrados('todos').length})
          </button>

          {/* 👉 NUEVO: pestaña "Servicios" */}
          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'servicios'
                ? 'bg-[#174940] text-white shadow-md'
                : 'bg-[#174940]/10 text-[#174940] hover:bg-[#174940]/20'
            }`}
          >
            Servicios ({serviciosFiltrados.length})
          </button>

          {/* Pestañas de categorías */}
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setActiveTab(categoria.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === categoria.id
                  ? 'bg-[#174940] text-white shadow-md'
                  : 'bg-[#174940]/10 text-[#174940] hover:bg-[#174940]/20'
              }`}
            >
              {categoria.nombre} ({productosFiltrados(categoria.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="mb-12">
        {activeTab === 'todos' ? (
          <>
            {productosFiltrados('todos').length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 italic text-lg">
                  {searchQuery
                    ? `No se encontraron productos para "${searchQuery}"`
                    : 'No hay productos disponibles'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosFiltrados('todos').map((producto) => (
                  <ProductCard key={producto.id} producto={producto} getImageDataUrl={getImageDataUrl} />
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'servicios' ? ( // 👉 NUEVO: render de servicios
          <>
            {serviciosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 italic text-lg">
                  {searchQuery
                    ? `No se encontraron servicios para "${searchQuery}"`
                    : 'No hay servicios disponibles'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {serviciosFiltrados.map((svc) => (
                  <ServiceCard key={svc.id} service={svc} />
                ))}
              </div>
            )}
          </>
        ) : (
          // Contenido para categorías específicas
          categorias.map((categoria) => {
            if (categoria.id !== activeTab) return null;

            const productosCategoria = productosFiltrados(categoria.id);

            return (
              <div key={categoria.id} className="mb-12">
                {productosCategoria.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 italic text-lg">No hay productos en esta categoría.</div>
                    <p className="text-gray-400 mt-2">Intenta con otra búsqueda o categoría.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {productosCategoria.length > LIMITE_PRODUCTOS_SCROLL && (
                      <button
                        title='categoria'
                        onClick={() => scrollLeft(categoria.id)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#174940]/10"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}

                    <div
                      ref={(el) => { scrollRefs.current[categoria.id] = el; }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {productosCategoria.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} getImageDataUrl={getImageDataUrl} />
                      ))}
                    </div>

                    {productosCategoria.length > LIMITE_PRODUCTOS_SCROLL && (
                      <button
                        title='producto'
                        onClick={() => scrollRight(categoria.id)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#174940]/10"
                      >
                        <ChevronRight size={24} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
