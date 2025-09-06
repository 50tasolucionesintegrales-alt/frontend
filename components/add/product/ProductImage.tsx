'use client'

import { useCallback, useEffect, useState } from 'react'
import { Box } from 'lucide-react'

type ProductImageProps = {
  productId: string
  productName: string
  getProductImageDataUrl: (id: string) => Promise<string | null>
  className?: string // ej. "h-10 w-10" o "h-48 w-48"
}

export default function ProductImage({
  productId,
  productName,
  getProductImageDataUrl,
  className = 'h-10 w-10',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchImage = useCallback(async () => {
    let cancelled = false
    setLoading(true)
    setLoaded(false)
    setError(null)
    setImgSrc(null)
    try {
      const url = await getProductImageDataUrl(productId)
      if (cancelled) return
      setImgSrc(url ?? null)
    } catch (e) {
      if (cancelled) return
      setError((e as Error)?.message || 'No se pudo cargar la imagen')
      setImgSrc(null)
    } finally {
      if (!cancelled) setLoading(false)
    }
    return () => { cancelled = true }
  }, [productId, getProductImageDataUrl])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (cancelled) return
      await fetchImage()
    })()
    return () => { cancelled = true }
  }, [fetchImage])

  return (
    <div
      className={`relative ${className} overflow-hidden rounded-md`}
      aria-busy={loading ? 'true' : 'false'}
      aria-live="polite"
    >
      {/* Cargando */}
      {loading && <div className="absolute inset-0 animate-pulse bg-gray-100" />}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-label="Cargando imagen">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" fill="currentColor" className="opacity-75" />
          </svg>
        </div>
      )}

      {/* Éxito */}
      {imgSrc && !error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={productName}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Sin imagen / Error */}
      {!loading && (!imgSrc || error) && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-1">
          <Box className="h-5 w-5 text-gray-400" />
          <span className="text-[11px] text-gray-400">{error ? 'Error' : 'Sin imagen'}</span>
          <button
            type="button"
            onClick={fetchImage}
            className="mt-1 px-2 py-0.5 text-[11px] rounded bg-[#174940] text-white hover:bg-[#0F332D] transition-colors"
            aria-label="Reintentar cargar imagen"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}
