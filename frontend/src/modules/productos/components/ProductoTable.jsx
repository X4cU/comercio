import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export function ProductoTable({ productos = [], onEdit, onDelete }) {
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Foto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Subcategoría</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Precio final</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/70">
                <td className="px-4 py-3">
                  <div className="aspect-square h-14 w-14 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">Sin foto</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{producto.nombre}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{producto.descripcion || 'Sin descripción'}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{producto.categoriaNombre}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{producto.subcategoriaNombre || '—'}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${producto.precioFinal?.toFixed ? producto.precioFinal.toFixed(2) : Number(producto.precioFinal || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{producto.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(producto)}
                      className="inline-flex items-center gap-1 rounded-md border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-900/40"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductoAEliminar(producto)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {productoAEliminar && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirmar eliminación</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              ¿Deseas eliminar <span className="font-semibold">{productoAEliminar.nombre}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setProductoAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                onClick={() => {
                  onDelete?.(productoAEliminar);
                  setProductoAEliminar(null);
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
