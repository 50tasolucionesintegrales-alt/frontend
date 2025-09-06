'use client';

import { Producto } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type Props = {
  producto: Producto;
  getImageDataUrl: (id: string) => Promise<string | null>;
};

export default function ProductCard({ producto, getImageDataUrl }: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = useCallback(async () => {
    setLoading(true);
    setLoaded(false);
    setError(null);
    setImgSrc(null);

    let active = true;
    try {
      const url = await getImageDataUrl(producto.id);
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
  }, [producto.id, getImageDataUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchImage();
    })();
    return () => { cancelled = true; };
  }, [fetchImage]);

  return (
    <div className="flex-shrink-0 w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div
        className="relative h-48 overflow-hidden rounded-t-xl"
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

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-[#0F332D] truncate flex-1">{producto.nombre}</h3>
          <span className="text-xs bg-[#174940]/10 text-[#174940] px-2 py-1 rounded ml-2">
            {producto.category.nombre}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 h-10 mt-1">{producto.descripcion}</p>
        <p className="text-[#63B23D] font-semibold mt-2">${producto.precio}</p>
        <div className="flex gap-2 mt-3">
          <Link
            href={`/catalog/${producto.id}`}
            className="flex-1 py-2 bg-[#174940] text-white rounded-lg text-center hover:bg-[#0F332D] transition-colors"
          >
            Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
