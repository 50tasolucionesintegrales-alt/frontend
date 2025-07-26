'use client';

import { ArrowLeft, ShoppingCart, Share2, Heart, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Producto } from '@/src/schemas';
import { useRouter } from 'next/navigation';

interface Props {
    producto: Producto;
}

export default function ProductDetail({ producto }: Props) {

    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => (router.back())} className="inline-flex items-center text-[#174940] hover:text-[#0F332D] mb-4 transition">
                    <ArrowLeft size={18} className="mr-1" />
                    Volver al catálogo
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        <div>
                            <img
                                src={producto.image_url}
                                alt={producto.nombre}
                                className="w-full h-96 object-contain rounded-xl bg-gray-100"
                            />
                        </div>

                        <div>
                            <div className="mb-4">
                                <span className="inline-block bg-[#174940]/10 text-[#174940] text-xs px-2 py-1 rounded mb-2">
                                    {producto.category.nombre}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#0F332D]">{producto.nombre}</h1>
                                <div className="mt-2">
                                    <span className="text-[#63B23D] font-bold text-xl mr-3">${producto.precio}</span>
                                </div>
                            </div>

                            <div className="bg-[#f8f9fa] rounded-lg p-4 mb-6 border border-[#999999]/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#174940] flex items-center justify-center text-white">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#999999]">Agregado por:</p>
                                        <p className="font-medium text-[#0F332D]">{producto.createdBy?.nombre || 'Usuario desconocido'}</p>
                                        <p className="text-xs text-[#999999] flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(producto.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-[#0F332D] mb-2">Descripción</h3>
                                <p className="text-[#0F332D]/90">{producto.descripcion || 'Sin descripción'}</p>
                            </div>

                            <div className="flex gap-6 text-sm mb-6">
                                <div>
                                    <span className="text-[#999999]">Disponibilidad:</span>
                                    <span className="ml-2 text-[#63B23D] font-medium">En stock</span>
                                </div>
                            </div>

                            <div className="flex gap-6 text-sm mb-6">
                                <div>
                                    <span className="text-[#999999]">Link de compra:</span>
                                    <a href={producto.link_compra} className="ml-2 text-[#63B23D] font-medium">{producto.link_compra}</a>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={''}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#63B23D] hover:bg-[#4a8a2e] text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={18} />
                                    Cotizar
                                </a>
                                <button className="p-3 border border-[#999999]/30 hover:bg-gray-50 rounded-lg transition">
                                    <Heart size={18} className="text-[#0F332D]" />
                                </button>
                                <button className="p-3 border border-[#999999]/30 hover:bg-gray-50 rounded-lg transition">
                                    <Share2 size={18} className="text-[#0F332D]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
