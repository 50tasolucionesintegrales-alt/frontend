'use client'

import { useState } from 'react'
import ProductServiceManager from '@/components/add/ProductServiceManager'
import ProductTable from './product/TablaProductos'
// import ServiceTable from '@/components/admin/services/ServiceTable'
// import CategoryTable from '@/components/admin/categories/CategoryTable'
import { Categoria, Producto, Service } from '@/src/schemas'
import ServiceTable from './service/servicetable'
import CategoryTable from './Category/CategoriesTable'

type Props = { categorias: Categoria[], products: Producto[], services: Service[], getProductImageDataUrl: (id: string) => Promise<string | null> }
type TopTab = 'crear' | 'administrar'
type ManageTab = 'productos' | 'servicios' | 'categorias'

export default function ProductAddAndManage({ categorias, products, services, getProductImageDataUrl }: Props) {
  const [topTab, setTopTab] = useState<TopTab>('crear')
  const [manageTab, setManageTab] = useState<ManageTab>('productos')

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Tabs superiores */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTopTab('crear')}
          className={`px-4 py-2 ${topTab==='crear'?'border-b-2 border-[#174940] text-[#174940] font-medium':''}`}
        >Crear</button>
        <button
          onClick={() => setTopTab('administrar')}
          className={`px-4 py-2 ${topTab==='administrar'?'border-b-2 border-[#174940] text-[#174940] font-medium':''}`}
        >Administrar</button>
      </div>

      {topTab === 'crear' ? (
        <ProductServiceManager categorias={categorias} />
      ) : (
        <>
          {/* Subtabs de administrar */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setManageTab('productos')}
              className={`px-3 py-2 ${manageTab==='productos'?'bg-[#174940] text-white rounded-t':''}`}
            >Productos</button>
            <button
              onClick={() => setManageTab('servicios')}
              className={`px-3 py-2 ${manageTab==='servicios'?'bg-[#174940] text-white rounded-t':''}`}
            >Servicios</button>
            <button
              onClick={() => setManageTab('categorias')}
              className={`px-3 py-2 ${manageTab==='categorias'?'bg-[#174940] text-white rounded-t':''}`}
            >Categorías</button>
          </div>

          <div className="border rounded-b p-4 bg-white shadow-sm">
            {manageTab === 'productos' && <ProductTable products={products} categorias={categorias} getProductImageDataUrl={getProductImageDataUrl} />}
            {manageTab === 'servicios' && <ServiceTable services={services} />}
            {manageTab === 'categorias' && <CategoryTable categorias={categorias} />}
          </div>
        </>
      )}
    </div>
  )
}
