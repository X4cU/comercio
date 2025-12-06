import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  AdjustmentsHorizontalIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';

const tipoConfig = {
  ingreso: {
    label: 'Ingreso',
    icon: ArrowDownIcon,
    classes: 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100'
  },
  egreso: {
    label: 'Egreso',
    icon: ArrowUpIcon,
    classes: 'bg-red-50 text-red-700 ring-red-100 dark:bg-red-900/30 dark:text-red-100'
  },
  ajuste_positivo: {
    label: 'Ajuste +',
    icon: AdjustmentsHorizontalIcon,
    classes: 'bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-100'
  },
  ajuste_negativo: {
    label: 'Ajuste -',
    icon: MinusCircleIcon,
    classes: 'bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-900/30 dark:text-orange-100'
  }
};

const formatFecha = (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

export function MovimientoTable({ movimientos = [] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Fecha
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Producto
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Tipo
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Cantidad
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Stock resultante
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Responsable
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Motivo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {movimientos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No hay movimientos registrados aún.
                </td>
              </tr>
            )}
            {movimientos.map((movimiento) => {
              const config = tipoConfig[movimiento.tipo] || tipoConfig.ingreso;
              const Icon = config.icon;
              return (
                <tr key={movimiento.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-200">
                    {formatFecha(movimiento.fecha)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                        {movimiento.productoImagen ? (
                          <img src={movimiento.productoImagen} alt={movimiento.productoNombre} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-50">{movimiento.productoNombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {movimiento.productoId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${config.classes}`}
                    >
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-50">{movimiento.cantidad}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{movimiento.stockResultante}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{movimiento.responsable || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{movimiento.motivo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
