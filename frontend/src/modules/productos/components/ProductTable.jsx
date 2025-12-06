import React from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export function ProductTable({ productos, onEliminar, page, totalPages, onPageChange }) {
  return (
    <div className="table-base">
      <table className="w-full">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col">Margen</th>
            <th scope="col">Estado</th>
            <th scope="col" className="text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 && (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No hay productos que coincidan con los filtros.
              </td>
            </tr>
          )}
          {productos.map((producto) => (
            <tr key={producto.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-800">
                    {producto.imagenes?.[0] ? (
                      <img
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">Sin imagen</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{producto.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{producto.descripcion}</p>
                  </div>
                </div>
              </td>
              <td className="text-sm font-medium text-gray-700 dark:text-gray-200">{producto.categoria}</td>
              <td className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                ${producto.precio.toFixed(2)} / {producto.unidad_medida}
              </td>
              <td className="text-sm text-gray-700 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{producto.stock_actual}</span>
                  <span className="text-xs text-gray-500">({producto.stock_optimo} óptimo)</span>
                </div>
              </td>
              <td className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{(producto.margen * 100).toFixed(0)}%</td>
              <td>
                <span className={`status-pill ${producto.estado ? 'active' : 'inactive'}`}>
                  <span className={`h-2 w-2 rounded-full ${producto.estado ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {producto.estado ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    to={`/productos/${producto.id}`}
                    className="btn-ghost"
                    aria-label={`Ver ${producto.nombre}`}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/productos/${producto.id}/editar`}
                    className="btn-secondary"
                    aria-label={`Editar ${producto.nombre}`}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Editar</span>
                  </Link>
                  <button
                    type="button"
                    className="btn-ghost text-rose-500 hover:text-rose-600"
                    onClick={() => onEliminar(producto)}
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
        <span>
          Página {page} de {totalPages || 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-1 text-xs"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1 text-xs"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
