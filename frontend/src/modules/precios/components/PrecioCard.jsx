import React from 'react';
import { TagIcon } from '@heroicons/react/24/outline';

export function PrecioCard({ producto, precio, ofertaActiva, onEditar, onCrearOferta }) {
  const tieneOferta = Boolean(ofertaActiva);
  const { precioVenta = 0, precioCompra = 0 } = precio || {};
  const precioFinal = tieneOferta ? ofertaActiva.precioFinal : precioVenta;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">Sin foto</div>
        )}
        {tieneOferta && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-emerald-900/70 dark:text-emerald-100 dark:ring-emerald-800">
            <TagIcon className="h-4 w-4" /> Oferta activa
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{producto.categoria || 'General'}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{producto.nombre}</h3>
            {producto.subcategoria && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{producto.subcategoria}</p>
            )}
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
            <p>Stock: {producto.stock ?? 0}</p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700 ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Precio compra</span>
            <span className="font-semibold">${precioCompra.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Precio venta</span>
            <div className="flex items-center gap-2">
              {tieneOferta && (
                <span className="text-xs font-semibold text-gray-400 line-through">${precioVenta.toFixed(2)}</span>
              )}
              <span className="text-lg font-bold text-gray-900 dark:text-gray-50">${precioFinal.toFixed(2)}</span>
            </div>
          </div>
          {tieneOferta && (
            <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-200">
              <span>Descuento {ofertaActiva.porcentajeAplicado}%</span>
              <span>
                Vigencia {new Date(ofertaActiva.fechaInicio).toLocaleDateString()} -{' '}
                {new Date(ofertaActiva.fechaFin).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEditar?.(producto)}
            className="btn-secondary w-full"
          >
            Editar precio
          </button>
          <button
            type="button"
            onClick={() => onCrearOferta?.(producto)}
            className="btn-primary w-full"
          >
            Nueva oferta
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrecioCard;
