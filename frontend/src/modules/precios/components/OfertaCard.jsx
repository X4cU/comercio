import React from 'react';
import { TagIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const estadoStyles = {
  activa: 'bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:ring-emerald-800',
  programada: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:ring-amber-800',
  expirada: 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800/60 dark:text-gray-200 dark:ring-gray-700'
};

export function OfertaCard({ oferta, producto, onDesactivar, mostrarAcciones = true }) {
  const estadoClass = estadoStyles[oferta.estado] || estadoStyles.activa;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            {producto?.imagen ? (
              <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">Sin foto</div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{producto?.categoria || 'Producto'}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{producto?.nombre || 'Producto'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{producto?.subcategoria || 'General'}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${estadoClass}`}>
          {oferta.estado === 'programada' && <ClockIcon className="h-4 w-4" />}
          {oferta.estado === 'expirada' && <ExclamationTriangleIcon className="h-4 w-4" />}
          {oferta.estado === 'activa' && <TagIcon className="h-4 w-4" />}
          {oferta.estado?.toUpperCase() || 'ACTIVA'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Precio original</p>
          <p className="text-lg font-semibold text-gray-600 line-through dark:text-gray-300">${oferta.precioBase?.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-sm ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100 dark:ring-emerald-800">
          <p className="text-xs uppercase tracking-wide">Precio final</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-100">${oferta.precioFinal?.toFixed(2)}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-200">-{oferta.porcentajeAplicado}%</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Tipo descuento</p>
          <p className="font-semibold capitalize">{oferta.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'}</p>
          <p className="text-xs text-gray-500">Valor: {oferta.tipo === 'porcentaje' ? `${oferta.valor}%` : `$${oferta.valor}`}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
            Inicio: {new Date(oferta.fechaInicio).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
            Fin: {new Date(oferta.fechaFin).toLocaleDateString()}
          </span>
          {oferta.comentario && <span className="text-xs text-gray-500">{oferta.comentario}</span>}
        </div>
        {mostrarAcciones && (
          <button
            type="button"
            onClick={() => onDesactivar?.(oferta)}
            className="btn-ghost text-rose-600 hover:text-rose-700 dark:text-rose-300"
          >
            Desactivar oferta
          </button>
        )}
      </div>
    </div>
  );
}

export default OfertaCard;
