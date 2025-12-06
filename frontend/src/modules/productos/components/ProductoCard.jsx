import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export function ProductoCard({ producto, categoriaNombre, subcategoriaNombre, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Sin foto</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{categoriaNombre}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{producto.nombre}</h3>
            {subcategoriaNombre && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subcategoriaNombre}</p>
            )}
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            ${producto.precioFinal?.toFixed ? producto.precioFinal.toFixed(2) : Number(producto.precioFinal || 0).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">{producto.descripcion || 'Sin descripción'}</p>
        <div className="mt-auto flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Stock: {producto.stock}</span>
          <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-100">
            {producto.unidad}
          </span>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEdit?.(producto)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-900/40"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Eliminar producto</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              ¿Seguro deseas eliminar <span className="font-semibold">{producto.nombre}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setConfirming(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                onClick={() => {
                  onDelete?.(producto);
                  setConfirming(false);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
