import React, { useEffect, useMemo, useState } from 'react';
import { useStockStore } from '../store/useStockStore';
import { FiltrosStock } from '../components/FiltrosStock';
import { TablaStockDetalle } from '../components/TablaStockDetalle';

const PAGE_SIZE = 6;

export default function AlertasStock() {
  const { stock, loading, filtros, cargarStock, setFiltros, filtrarStock } = useStockStore();
  const [orden, setOrden] = useState('stock');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (stock.length === 0) cargarStock();
  }, [cargarStock, stock.length]);

  useEffect(() => {
    setPage(1);
  }, [filtros.texto, filtros.categoria, filtros.estado, orden]);

  const categorias = useMemo(() => Array.from(new Set(stock.map((item) => item.categoria))), [stock]);

  const filtrados = filtrarStock();

  const ordenados = useMemo(() => {
    const copia = [...filtrados];
    if (orden === 'stock') {
      return copia.sort((a, b) => a.stock_actual - b.stock_actual);
    }
    return copia.sort((a, b) => a.dias_restantes - b.dias_restantes);
  }, [filtrados, orden]);

  const totalPages = Math.max(1, Math.ceil(ordenados.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagina = ordenados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Inventario</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Alertas de stock</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Filtra por categoría, estado de alerta y prioriza los productos con menor stock o menor vida útil restante.
        </p>
      </div>

      <FiltrosStock
        filtros={filtros}
        categorias={categorias}
        orden={orden}
        onFiltrosChange={setFiltros}
        onOrdenChange={setOrden}
      />

      <TablaStockDetalle items={pagina} page={currentPage} totalPages={totalPages} onPageChange={setPage} />

      {loading && <p className="text-sm text-gray-500">Cargando alertas...</p>}
    </div>
  );
}
