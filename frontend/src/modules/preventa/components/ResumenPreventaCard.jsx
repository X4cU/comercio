import React from 'react';

export default function ResumenPreventaCard({ preventa, onVerDetalle }) {
  const fecha = new Date(preventa.fecha_creacion);
  const totalItems = preventa.items?.length || 0;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{fecha.toLocaleDateString()}</p>
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Pre-venta #{preventa.id}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">{preventa.notas || 'Sin notas adicionales'}</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Ítems</span>
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Total neto</span>
          <span className="text-base font-semibold text-emerald-700 dark:text-emerald-200">${
            Number(preventa.total_neto || 0).toFixed(2)
          }</span>
        </div>
        <button
          type="button"
          onClick={() => onVerDetalle?.(preventa)}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}
