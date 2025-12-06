import React, { useEffect, useMemo, useState } from 'react';
import { MovimientoTable } from '../components/MovimientoTable';
import { stockService } from '../services/stockService';
import { productosService } from '../../productos/services/productosService';

export default function HistorialMovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ productoId: '', tipo: '', desde: '', hasta: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [movs, prods] = await Promise.all([
        stockService.getMovimientos(),
        productosService.getProductosLite()
      ]);
      setMovimientos(movs);
      setProductos(prods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((movimiento) => {
      const fecha = new Date(movimiento.fecha);
      const cumpleProducto = filtros.productoId ? movimiento.productoId === filtros.productoId : true;
      const cumpleTipo = filtros.tipo ? movimiento.tipo === filtros.tipo : true;
      const cumpleDesde = filtros.desde ? fecha >= new Date(filtros.desde) : true;
      const cumpleHasta = filtros.hasta ? fecha <= new Date(`${filtros.hasta}T23:59:59`) : true;
      return cumpleProducto && cumpleTipo && cumpleDesde && cumpleHasta;
    });
  }, [filtros, movimientos]);

  const totalIngresos = movimientosFiltrados
    .filter((mov) => mov.tipo === 'ingreso' || mov.tipo === 'ajuste_positivo')
    .reduce((acc, mov) => acc + mov.cantidad, 0);
  const totalEgresos = movimientosFiltrados
    .filter((mov) => mov.tipo === 'egreso' || mov.tipo === 'ajuste_negativo')
    .reduce((acc, mov) => acc + mov.cantidad, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Stock</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Historial de movimientos</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Filtra por producto, tipo o rango de fechas.</p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Registros</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">{movimientosFiltrados.length}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Movimientos en el rango seleccionado.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Entradas</p>
          <h3 className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-300">+{totalIngresos}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Incluye ingresos y ajustes positivos.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Salidas</p>
          <h3 className="mt-1 text-2xl font-bold text-red-600 dark:text-red-300">-{totalEgresos}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Incluye egresos y ajustes negativos.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Balance</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">{totalIngresos - totalEgresos}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Resultado neto del periodo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-4">
        <select
          value={filtros.productoId}
          onChange={(e) => setFiltros((prev) => ({ ...prev, productoId: e.target.value }))}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
        >
          <option value="">Todos los productos</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
        <select
          value={filtros.tipo}
          onChange={(e) => setFiltros((prev) => ({ ...prev, tipo: e.target.value }))}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
        >
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
          <option value="ajuste_positivo">Ajuste positivo</option>
          <option value="ajuste_negativo">Ajuste negativo</option>
        </select>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Desde</label>
          <input
            type="date"
            value={filtros.desde}
            onChange={(e) => setFiltros((prev) => ({ ...prev, desde: e.target.value }))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Hasta</label>
          <input
            type="date"
            value={filtros.hasta}
            onChange={(e) => setFiltros((prev) => ({ ...prev, hasta: e.target.value }))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Cargando movimientos...
        </div>
      ) : (
        <MovimientoTable movimientos={movimientosFiltrados} />
      )}
    </div>
  );
}
