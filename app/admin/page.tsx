'use client';
import { BarChart2, PieChart, Users, ShoppingCart, ClipboardList, Award, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EstadisticasPage() {
  const [periodo, setPeriodo] = useState('mes');

  // Datos de ejemplo para las estadísticas
  const datos = {
    resumen: {
      usuariosActivos: 24,
      cotizacionesRealizadas: 156,
      ordenesCompletadas: 89,
      productosAgregados: 342
    },
    topCotizadores: [
      { nombre: 'María García', cantidad: 42, rol: 'Cotizador' },
      { nombre: 'Juan Pérez', cantidad: 38, rol: 'Cotizador' },
      { nombre: 'Carlos López', cantidad: 27, rol: 'Administrador' },
      { nombre: 'Ana Martínez', cantidad: 22, rol: 'Cotizador' },
      { nombre: 'Luisa Fernández', cantidad: 18, rol: 'Cotizador' }
    ],
    topCompradores: [
      { nombre: 'Roberto Sánchez', cantidad: 23, rol: 'Comprador' },
      { nombre: 'Patricia Ruiz', cantidad: 19, rol: 'Comprador' },
      { nombre: 'Carlos López', cantidad: 15, rol: 'Administrador' },
      { nombre: 'David González', cantidad: 12, rol: 'Comprador' },
      { nombre: 'Sofía Vargas', cantidad: 10, rol: 'Comprador' }
    ],
    productosMasCotizados: [
      { nombre: 'Laptop HP EliteBook', cantidad: 87 },
      { nombre: 'Monitor LED 24"', cantidad: 65 },
      { nombre: 'Teclado inalámbrico', cantidad: 43 },
      { nombre: 'Mouse ergonómico', cantidad: 38 },
      { nombre: 'Impresora multifunción', cantidad: 31 }
    ],
    tendenciaMensual: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
      cotizaciones: [45, 58, 60, 72, 65, 83, 90],
      ordenes: [28, 32, 40, 45, 38, 52, 60]
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#174940] flex items-center gap-3">
            <BarChart2 size={28} className="text-[#63B23D]" />
            Estadísticas y Métricas
          </h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-600">Métricas clave del sistema</p>
            <select 
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] text-sm"
            >
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
              <option value="trimestre">Último trimestre</option>
              <option value="anio">Último año</option>
            </select>
          </div>
        </header>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <Link href='/admin/new-users' className="flex items-center gap-4 group">
              <div className="p-3 rounded-full bg-[#174940]/10 text-[#63B23D] group-hover:bg-[#63B23D]/20 transition-colors">
                <Users size={24} className="group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174940] tracking-tight">Nuevos usuarios</h3>
                <p className="text-base font-medium text-[#63B23D] mt-1">Asignar roles pendientes</p>
              </div>
              <ChevronRight className="ml-auto text-[#999999] group-hover:text-[#63B23D] transition-colors" size={20} />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <Link href='/admin/users' className="flex items-center gap-4 group">
              <div className="p-3 rounded-full bg-[#174940]/10 text-[#63B23D] group-hover:bg-[#63B23D]/20 transition-colors">
                <Users size={24} className="group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#174940] tracking-tight">Gestión de usuarios</h3>
                <p className="text-base font-medium text-[#63B23D] mt-1">Modificar o eliminar</p>
              </div>
              <ChevronRight className="ml-auto text-[#999999] group-hover:text-[#63B23D] transition-colors" size={20} />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <ClipboardList size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Cotizaciones realizadas</h3>
                <p className="text-2xl font-bold text-[#174940]">{datos.resumen.cotizacionesRealizadas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <ShoppingCart size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Órdenes completadas</h3>
                <p className="text-2xl font-bold text-[#174940]">{datos.resumen.ordenesCompletadas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Productos agregados</h3>
                <p className="text-2xl font-bold text-[#174940]">{datos.resumen.productosAgregados}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos y tablas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top cotizadores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#174940] flex items-center gap-2">
                <Award size={20} className="text-[#63B23D]" />
                Top Cotizadores
              </h2>
              <span className="text-sm text-gray-500">Último {periodo}</span>
            </div>
            
            <div className="space-y-4">
              {datos.topCotizadores.map((usuario, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{usuario.nombre}</p>
                      <p className="text-xs text-gray-500">{usuario.rol}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#174940]">{usuario.cantidad} cotiz.</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top compradores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#174940] flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#63B23D]" />
                Top Compradores
              </h2>
              <span className="text-sm text-gray-500">Último {periodo}</span>
            </div>
            
            <div className="space-y-4">
              {datos.topCompradores.map((usuario, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{usuario.nombre}</p>
                      <p className="text-xs text-gray-500">{usuario.rol}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#174940]">{usuario.cantidad} órdenes</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos más cotizados */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#174940] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#63B23D]" />
              Productos Más Cotizados
            </h2>
            <span className="text-sm text-gray-500">Último {periodo}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Producto</th>
                  <th className="pb-3 text-right">Veces cotizado</th>
                  <th className="pb-3 text-right">% del total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {datos.productosMasCotizados.map((producto, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3 font-medium">{producto.nombre}</td>
                    <td className="py-3 text-right">{producto.cantidad}</td>
                    <td className="py-3 text-right">
                      {Math.round((producto.cantidad / datos.resumen.cotizacionesRealizadas) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico de tendencia */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#174940] flex items-center gap-2">
              <BarChart2 size={20} className="text-[#63B23D]" />
              Tendencia Mensual
            </h2>
            <span className="text-sm text-gray-500">Últimos 7 meses</span>
          </div>
          
          <div className="h-64">
            {/* Aquí iría un gráfico real con una librería como Chart.js */}
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              [Área para gráfico de tendencias]
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#63B23D]"></div>
              <span className="text-sm text-gray-600">Cotizaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#174940]"></div>
              <span className="text-sm text-gray-600">Órdenes completadas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}