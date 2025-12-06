import React, { useEffect, useMemo, useState } from 'react';
import { useIngresosStore } from '../store/useIngresosStore';
import { TablaHistorialIngresos } from '../components/TablaHistorialIngresos';

const sortDate = (a, b, direction) => {
  const dir = direction === 'asc' ? 1 : -1;
  return (new Date(a).getTime() - new Date(b).getTime()) * dir;
};

export default function HistorialIngresos() {
  const { ingresos, filtros, loading, cargarIngresos, setFiltros, getIngresosFiltrados } = useIngresosStore();
  const [sortState, setSortState] = useState({ sortBy: 'fecha_llegada', sortDirection: 'desc' });

  useEffect(() => {
    if (!ingresos.length) cargarIngresos();
  }, [cargarIngresos, ingresos.length]);

  const productosUnicos = useMemo(() => {
    const map = new Map();
    ingresos.forEach((ing) => {
      map.set(ing.productoId, { id: ing.productoId, nombre: ing.nombre_producto });
    });
    return Array.from(map.values());
  }, [ingresos]);

  const ingresosFiltrados = useMemo(() => {
    const base = getIngresosFiltrados();
    return [...base].sort((a, b) => {
      if (sortState.sortBy === 'fecha_llegada' || sortState.sortBy === 'fecha_vencimiento') {
        return sortDate(a[sortState.sortBy], b[sortState.sortBy], sortState.sortDirection);
      }
      const dir = sortState.sortDirection === 'asc' ? 1 : -1;
      if (a[sortState.sortBy] > b[sortState.sortBy]) return dir;
      if (a[sortState.sortBy] < b[sortState.sortBy]) return -dir;
      return 0;
    });
  }, [getIngresosFiltrados, sortState, ingresos, filtros]);

  const handleFilterChange = (field, value) => {
    setFiltros({ [field]: value });
  };

  const limpiarFiltros = () => {
    setFiltros({ productoId: '', tipo_seccion: '', fecha_desde: '', fecha_hasta: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Stock</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Historial de ingresos</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visualizá los ingresos registrados con filtros rápidos por producto, sección y fechas.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span>Producto</span>
            <select
              value={filtros.productoId}
              onChange={(e) => handleFilterChange('productoId', e.target.value)}
              className="min-w-[200px]"
            >
              <option value="">Todos</option>
              {productosUnicos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span>Tipo sección</span>
            <select value={filtros.tipo_seccion} onChange={(e) => handleFilterChange('tipo_seccion', e.target.value)}>
              <option value="">Todos</option>
              <option value="VERDULERIA">Verdulería</option>
              <option value="DESPENSA">Despensa</option>
              <option value="FIAMBRERIA">Fiambrería</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span>Fecha desde</span>
            <input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span>Fecha hasta</span>
            <input type="date" value={filtros.fecha_hasta} onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)} />
          </label>

          <button type="button" className="btn-secondary ml-auto" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>

        <TablaHistorialIngresos
          ingresos={ingresosFiltrados}
          sortBy={sortState.sortBy}
          sortDirection={sortState.sortDirection}
          onSortChange={setSortState}
        />

        {loading && <p className="text-sm text-gray-500">Cargando ingresos...</p>}
      </div>
    </div>
  );
}
