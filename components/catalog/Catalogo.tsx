'use client';

import { Categoria, Producto } from '@/src/schemas';
import { ChevronRight, ChevronLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';

type props = {
    categorias: Categoria[]
    productos: Producto[]
}

export default function Catalogo({ categorias, productos }: props) {
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const LIMITE_PRODUCTOS_SCROLL = 4; // número límite para activar scroll

    const productosFiltrados = (categoriaId: string) => {
        return productos.filter(
            (prod) =>
                prod.category.id === categoriaId &&
                prod.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const scrollLeft = (categoryId: string) => {
        if (scrollRefs.current[categoryId]) {
            scrollRefs.current[categoryId].scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = (categoryId: string) => {
        if (scrollRefs.current[categoryId]) {
            scrollRefs.current[categoryId].scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="flex gap-3 mb-8">
                <div className="relative flex-1 md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Search size={18} className="text-[#999999]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="pl-10 pr-4 py-2 w-full border border-[#999999]/30 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {categorias.map((categoria) => {
                const productosCategoria = productosFiltrados(categoria.id);

                return (
                    <div key={categoria.id} className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-[#174940]">
                                {categoria.nombre}
                            </h2>
                            {productosCategoria.length > 4 ? (
                                <Link href='' className='text-[#174940]'>
                                    Ver mas...
                                </Link>
                            ) : (
                                null
                            )}
                        </div>

                        {productosCategoria.length === 0 ? (
                            <div className="text-gray-500 italic">No hay productos en esta categoría.</div>
                        ) : (
                                <div className="relative">
                                    {productosCategoria.length > LIMITE_PRODUCTOS_SCROLL && (
                                        <button
                                            onClick={() => scrollLeft(categoria.id)}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#174940] p-2 rounded-full shadow-md"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                    )}

                                    <div
                                        ref={(el) => { scrollRefs.current[categoria.id] = el; }}
                                        className="flex overflow-x-auto gap-6 py-4 scrollbar-hide"
                                    >
                                        {productosCategoria.map((producto) => (
                                            <div
                                                key={producto.id}
                                                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm"
                                            >
                                                <div className="h-64 overflow-hidden rounded-t-xl">
                                                    <img
                                                        src={producto.image_url}
                                                        alt={producto.nombre}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="font-medium text-[#0F332D] truncate">
                                                        {producto.nombre}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {producto.descripcion}
                                                    </p>
                                                    <p className="text-[#63B23D] font-semibold mt-1">
                                                        ${producto.precio}
                                                    </p>
                                                    <div className="flex gap-2 mt-3">
                                                        <Link
                                                            href={`/catalog/${producto.id}`}
                                                            className="flex-1 py-2 bg-[#174940] text-white rounded-lg text-center"
                                                        >
                                                            Detalles
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {productosCategoria.length > LIMITE_PRODUCTOS_SCROLL && (
                                        <button
                                            onClick={() => scrollRight(categoria.id)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#174940] p-2 rounded-full shadow-md"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    )}
                                </div>

                        )}
                    </div>
                );
            })}
        </>
    );
}
