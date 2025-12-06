import React, { useEffect, useMemo, useState } from 'react';
import { TarjetaResumenStock } from '../components/TarjetaResumenStock';
import { useStockStore } from '../store/useStockStore';

export default function ResumenStock() {
  const { stock, loading, cargarStock, filtrarStock } = useStockStore();
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [soloPerecederos, setSoloPerecederos] = useState(false);

  useEffect(() => {
    if (stock.length === 0) cargarStock();
  }, [cargarStock, stock.length]);

  const resumen = useMemo(() => {
    const countByEstado = (estado) => stock.filter((item) => item.estado_stock === estado).length;
    return [
      { id: 'ok', titulo: 'Productos con stock OK', valor: countByEstado('OK'), detalle: 'En rango óptimo' },
      {
        id: 'reposicion',
        titulo: 'Productos a reponer',
        valor: countByEstado('REPOSICION'),
        detalle: 'Bajo stock respecto al óptimo'
      },
      {
        id: 'oferta',
        titulo: 'Productos en oferta sugerida',
        valor: countByEstado('OFERTA'),
        detalle: 'A 2 días del vencimiento'
      },
      {
        id: 'liquidacion',
        titulo: 'Productos en liquidación',
        valor: countByEstado('LIQUIDACION'),
        detalle: 'Último día de vida útil'
      }
    ];
  }, [stock]);

  const baseFiltrada = filtrarStock();

  const stockVisible = useMemo(() => {
    return baseFiltrada.filter((item) => {
      const critico = item.estado_stock !== 'OK';
      const pasaCriticos = soloCriticos ? critico : true;
      const pasaPerecedero = soloPerecederos ? item.es_perecedero : true;
      return pasaCriticos && pasaPerecedero;
    });
  }, [baseFiltrada, soloCriticos, soloPerecederos]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Inventario</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Stock y alertas</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visibilidad rápida del estado de stock por categoría, con alertas para reposición y liquidación.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resumen.map((item) => (
          <TarjetaResumenStock key={item.id} id={item.id} titulo={item.titulo} valor={item.valor} detalle={item.detalle} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn-secondary text-sm ${soloCriticos ? 'ring-2 ring-rose-300 dark:ring-rose-500' : ''}`}
          onClick={() => setSoloCriticos((prev) => !prev)}
        >
          Ver solo productos críticos
        </button>
        <button
          type="button"
          className={`btn-secondary text-sm ${soloPerecederos ? 'ring-2 ring-emerald-300 dark:ring-emerald-500' : ''}`}
          onClick={() => setSoloPerecederos((prev) => !prev)}
        >
          Ver solo perecederos
        </button>
      </div>

      <div className="card space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Comparativa stock vs óptimo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Barras horizontales mockeadas sin librería externa.</p>
        </div>
        <div className="space-y-3">
          {stockVisible.slice(0, 8).map((item) => {
            const porcentaje = Math.min(120, Math.round((item.stock_actual / item.stock_optimo) * 100));
            const color =
              item.estado_stock === 'LIQUIDACION'
                ? 'bg-rose-500'
                : item.estado_stock === 'OFERTA'
                  ? 'bg-orange-500'
                  : item.estado_stock === 'REPOSICION'
                    ? 'bg-amber-400'
                    : 'bg-emerald-500';
            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-semibold">{item.nombre_producto}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.stock_actual} / {item.stock_optimo} {item.unidad_medida}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-3 rounded-full ${color}`}
                    style={{ width: `${Math.max(8, porcentaje)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Cargando stock...</p>}
    </div>
  );
}
