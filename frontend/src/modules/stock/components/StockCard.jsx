import React from 'react';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export function StockCard({ producto, onMovimiento }) {
  const bajoStock = (producto.stock ?? 0) < 5;
  const categoriaLabel = producto.categoria || 'Sin categoría';

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-gray-900 ${
        bajoStock
          ? 'border-red-200 ring-1 ring-red-100 dark:border-red-800 dark:ring-red-900/40'
          : 'border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">Sin foto</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{categoriaLabel}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{producto.nombre}</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              bajoStock
                ? 'bg-red-50 text-red-700 ring-1 ring-red-100 dark:bg-red-900/30 dark:text-red-100'
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100'
            }`}
          >
            {bajoStock ? (
              <ArrowTrendingDownIcon className="h-4 w-4" />
            ) : (
              <ArrowTrendingUpIcon className="h-4 w-4" />
            )}
            Stock {producto.stock ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {producto.subcategoria || 'General'}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-100">
              {producto.unidad || 'u'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Alerta</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {bajoStock ? 'Stock bajo (alerta configurada)' : 'En niveles óptimos'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onMovimiento?.(producto)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Registrar movimiento
        </button>
      </div>
    </div>
  );
}
