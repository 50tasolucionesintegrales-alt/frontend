'use client';

import { ArrowLeft, ShoppingCart, Share2, Heart, User, Calendar, X } from 'lucide-react';
import { Order, Producto, Quote } from '@/src/schemas';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useCallback, useEffect, useMemo, useState } from 'react';
import { addItemsAction } from '@/actions/quotes/addItemsAction';
import { toast } from 'react-toastify';
import { Dialog } from '@headlessui/react';
import { createDraftAndAddItemAction } from '@/actions/quotes/createAndAddAction';
import AddToOrderModal from '../modals/catalog/AddToOrderModal';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    producto: Producto
    drafts: Quote[]
    orders: Order[]
    getProductImageDataUrl: (imageId: string) => Promise<string | null>
}

export default function ProductDetail({ producto, drafts, orders, getProductImageDataUrl }: Props) {

    const router = useRouter()
    
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderOpen, setOrderOpen] = useState(false)

    const fetchImage = useCallback(async () => {
        setLoading(true);
        setLoaded(false);
        setError(null);
        setImgSrc(null);

        let active = true;
        try {
            const url = await getProductImageDataUrl(producto.id);
            if (!active) return;
            if (!url) {
                setImgSrc(null);
            } else {
                setImgSrc(url);
            }
        } catch (e) {
            if (!active) return;
            setError((e as Error).message || 'No se pudo cargar la imagen');
            setImgSrc(null);
        } finally {
            if (active) setLoading(false);
        }

        return () => { active = false; };
    }, [producto.id, getProductImageDataUrl]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (cancelled) return;
            await fetchImage();
        })();
        return () => { cancelled = true; };
    }, [fetchImage]);


    const [open, setOpen] = useState(false);
    const [qty, setQty] = useState<number>(1);
    const [search, setSearch] = useState('');

    const availableQuotes = useMemo(() => {
        const pid = String(producto.id);
        return (drafts || []).filter(q =>
            q.status === 'draft' &&
            !(q.items || []).some(it => String(it.product?.id) === pid)
        );
    }, [drafts, producto.id]);

    const [aiState, aiDispatch, aiPending] = useActionState(addItemsAction, {
        errors: [], success: '',
    });

    useEffect(() => {
        aiState.errors?.forEach(e => toast.error(e));
        if (aiState.success) {
            toast.success('Producto agregado a la cotización');
            setOpen(false);
        }
    }, [aiState]);

    const handleAddToQuote = (quoteId: string) => {
        const costo = parseFloat(String(producto.precio ?? '0')) || 0;
        const fd = new FormData();
        fd.append('quoteId', quoteId);
        fd.append('items', JSON.stringify([{
            tipo: 'producto',
            productId: Number(producto.id),
            cantidad: qty,
            costoUnitario: +costo.toFixed(2),
            unidad: 'pieza'
        }]));
        startTransition(() => aiDispatch(fd));
    };

    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const [newState, newDispatch, newPending] = useActionState(createDraftAndAddItemAction, {
        errors: [],
        success: '',
    });

    useEffect(() => {
        newState.errors?.forEach(e => toast.error(e));
        if (newState.success) {
            toast.success(newState.success);
            setOpen(false);
        }
    }, [newState]);

    const handleCreateAndAdd = () => {
        const title = newTitle?.trim().slice(0, 80) || 'Cotización rápida';
        const description = (newDesc || '').trim().slice(0, 120);
        const cantidad = Math.max(1, Number(qty) || 1);

        const costo = Number(producto.precio);
        const costoUnitario = Number.isFinite(costo) ? costo : 0;

        const unidad = 'pieza';

        const fd = new FormData();
        fd.append('title', title);
        fd.append('description', description);
        fd.append('productId', String(producto.id));
        fd.append('cantidad', String(cantidad));
        fd.append('costoUnitario', costoUnitario.toFixed(2));
        fd.append('unidad', unidad);

        startTransition(() => newDispatch(fd));
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => (router.back())} className="inline-flex items-center text-[#174940] hover:text-[#0F332D] mb-4 transition">
                    <ArrowLeft size={18} className="mr-1" />
                    Volver al catálogo
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        <div
                            className="relative overflow-hidden rounded-t-xl"
                            aria-busy={loading ? 'true' : 'false'}
                            aria-live="polite"
                        >
                            {loading && (
                                <div className="absolute inset-0 animate-pulse bg-gray-100" />
                            )}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6 animate-spin"
                                        viewBox="0 0 24 24"
                                        aria-label="Cargando imagen"
                                    >
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                                        <path d="M4 12a8 8 0 018-8" fill="currentColor" className="opacity-75" />
                                    </svg>
                                </div>
                            )}

                            {imgSrc && !error && (
                                <Image
                                    src={imgSrc}
                                    alt={producto.nombre}
                                    width={400}
                                    height={400}
                                    loading="lazy"
                                    onLoad={() => setLoaded(true)}
                                    className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                                        }`}
                                    unoptimized
                                />
                            )}

                            {!loading && (!imgSrc || error) && (
                                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-2">
                                    <span className="text-gray-400">{error ? 'Error al cargar' : 'Sin imagen'}</span>
                                    <button
                                        type="button"
                                        onClick={fetchImage}
                                        className="px-3 py-1 text-xs rounded-md bg-[#174940] text-white hover:bg-[#0F332D] transition-colors"
                                        aria-label="Reintentar cargar imagen"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}
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
                                        <p className="font-medium text-[#0F332D]">{producto.createdBy?.nombre}</p>
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
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="flex-1 bg-[#63B23D] hover:bg-[#4a8a2e] text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={18} />
                                    Cotizar
                                </button>
                                <button
                                    onClick={() => setOrderOpen(true)}
                                    className="flex-1 bg-[#63B23D] hover:bg-[#4a8a2e] text-white py-3 px-6 rounded-lg font-medium transition"
                                >
                                    Agregar a orden
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de selección de cotización */}
            <AnimatePresence>
                {open && (
                    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
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
                                className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl mx-2"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title className="text-xl font-bold text-[#0F332D]">
                                        Agregar "{producto.nombre}" a una cotización
                                    </Dialog.Title>
                                    <button onClick={() => setOpen(false)}
                                        className="text-[#999] hover:text-[#0F332D] rounded-full p-1 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#0F332D]">Cantidad</span>
                                        <input
                                            title='cantidad'
                                            type="number"
                                            min={1}
                                            value={qty}
                                            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                                            className="w-24 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
                                        />
                                    </div>
                                    <div className="text-sm text-[#999]">
                                        Costo unitario base: ${producto.precio}
                                    </div>
                                    <div className="flex-1 w-full sm:w-auto">
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Buscar cotización..."
                                            className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
                                        />
                                    </div>
                                </div>

                                <ul className="max-h-72 overflow-auto divide-y divide-gray-200 rounded-lg border border-gray-200">
                                    {availableQuotes
                                        .filter(q => q.titulo.toLowerCase().includes(search.toLowerCase()))
                                        .map(q => (
                                            <li key={q.id} className="flex items-center justify-between p-4">
                                                <div>
                                                    <div className="font-medium text-[#0F332D]">{q.titulo}</div>
                                                    <div className="text-xs text-[#999]">ID: {q.id}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToQuote(q.id)}
                                                    disabled={aiPending}
                                                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${aiPending
                                                            ? 'bg-[#63B23D]/70 cursor-not-allowed text-white'
                                                            : 'bg-[#174940] hover:bg-[#0F332D] text-white shadow-sm'
                                                        }`}
                                                >
                                                    {aiPending ? 'Agregando…' : 'Agregar'}
                                                </button>
                                            </li>
                                        ))}

                                    {availableQuotes.length === 0 && (
                                        <li className="py-10 text-center text-[#999]">
                                            No hay cotizaciones disponibles (o ya está agregado en todas).
                                        </li>
                                    )}
                                </ul>

                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-[#0F332D] mb-4">
                                        o crear una nueva cotización
                                    </h3>
                                    <div className="space-y-4">
                                        <input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Título de la cotización"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
                                        />
                                        <textarea
                                            value={newDesc}
                                            onChange={(e) => setNewDesc(e.target.value)}
                                            placeholder="Descripción (opcional)"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition min-h-[80px]"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateAndAdd}
                                            disabled={newPending || !newTitle.trim()}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${newPending || !newTitle.trim()
                                                    ? 'bg-[#63B23D]/70 cursor-not-allowed text-white'
                                                    : 'bg-[#174940] hover:bg-[#0F332D] text-white shadow-sm'
                                                }`}
                                        >
                                            {newPending ? 'Creando…' : 'Crear y agregar producto'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="px-6 py-2.5 rounded-lg font-medium text-[#0F332D] hover:bg-gray-100 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
            <AddToOrderModal
                open={orderOpen}
                onOpenChange={setOrderOpen}
                productId={String(producto.id)}
                productPrice={producto.precio}
                orders={orders}
            />
        </div>
    );
}
