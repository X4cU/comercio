import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import { productosService } from '../../productos/services/productosService';
import { categoriasService } from '../../categorias/services/categoriasService';
import { StockCard } from '../components/StockCard';
import { stockService } from '../services/stockService';

export default function StockDashboardPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ busqueda: '', categoria: '', subcategoria: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [productosLite, categoriasData] = await Promise.all([
        productosService.getProductosLite(),
        categoriasService.getCategorias()
      ]);

      const productosConStock = productosLite.map((producto) => {
        const categoria = categoriasData.find((cat) => cat.id === producto.categoriaId);
        const subcategoria = categoria?.subcategorias?.find((sub) => sub.id === producto.subcategoriaId);
        return {
          ...producto,
          categoria: categoria?.nombre || producto.categoria || 'Sin categoría',
          subcategoria: subcategoria?.nombre || producto.subcategoria || 'General',
          stock: stockService.getStock(producto.id, producto.stock ?? 0)
        };
      });

      setProductos(productosConStock);
      setCategorias(categoriasData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const subcategoriasDisponibles = useMemo(() => {
    if (filtros.categoria) {
      return categorias.find((cat) => cat.id === filtros.categoria)?.subcategorias || [];
    }
    return categorias.flatMap((cat) => cat.subcategorias || []);
  }, [categorias, filtros.categoria]);

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((producto) =>
        producto.nombre.toLowerCase().includes(filtros.busqueda.trim().toLowerCase())
      )
      .filter((producto) => (filtros.categoria ? producto.categoriaId === filtros.categoria : true))
      .filter((producto) => (filtros.subcategoria ? producto.subcategoriaId === filtros.subcategoria : true))
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
  }, [productos, filtros]);

  const productosBajoStock = productosFiltrados.filter((producto) => (producto.stock ?? 0) < 5);

  const handleNuevoMovimiento = (producto) => {
    navigate('/stock/movimientos/nuevo', { state: { productoId: producto?.id } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Inventario</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Stock</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Controla entradas, salidas y ajustes con visibilidad en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/stock/historial')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <FunnelIcon className="h-5 w-5" />
            Historial de movimientos
          </button>
          <button
            type="button"
            onClick={() => navigate('/stock/movimientos/nuevo')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo movimiento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Alertas</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">{productosBajoStock.length}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Productos con stock bajo (&lt; 5 uds).</p>
          <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-300">Estructura lista para notificaciones futuras.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Buscar por nombre"
                value={filtros.busqueda}
                onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
                className="w-full border-none bg-transparent text-sm font-medium text-gray-800 focus:outline-none dark:text-gray-100"
              />
            </div>
            <select
              value={filtros.categoria}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, categoria: e.target.value, subcategoria: '' }))
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <select
              value={filtros.subcategoria}
              onChange={(e) => setFiltros((prev) => ({ ...prev, subcategoria: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
            >
              <option value="">Todas las subcategorías</option>
              {subcategoriasDisponibles.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <StockCard key={producto.id} producto={producto} onMovimiento={handleNuevoMovimiento} />
          ))}
          {productosFiltrados.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              No se encontraron productos con los filtros actuales.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
