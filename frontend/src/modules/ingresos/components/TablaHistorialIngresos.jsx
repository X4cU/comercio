import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
const formatDate = (date) => new Date(date).toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' });

const headers = [
  { key: 'fecha_llegada', label: 'Fecha llegada', sortable: true },
  { key: 'nombre_producto', label: 'Producto' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'tipo_seccion', label: 'Tipo sección' },
  { key: 'stock_ingresado', label: 'Stock ingresado' },
  { key: 'costo_bulto', label: 'Costo bulto' },
  { key: 'precio_final_calculado', label: 'Precio final' },
  { key: 'fecha_vencimiento', label: 'Fecha vencimiento', sortable: true }
];

export function TablaHistorialIngresos({ ingresos, sortBy, sortDirection, onSortChange }) {
  const renderSortIcon = (key) => {
    if (sortBy !== key) return null;
    return sortDirection === 'asc' ? (
      <ArrowUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-1 h-4 w-4" />
    );
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      onSortChange({ sortBy: key, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ sortBy: key, sortDirection: 'desc' });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900/60">
          <tr>
            {headers.map((header) => (
              <th key={header.key} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                {header.sortable ? (
                  <button
                    type="button"
                    className="flex items-center text-left hover:text-emerald-600 dark:hover:text-emerald-300"
                    onClick={() => handleSort(header.key)}
                  >
                    {header.label}
                    {renderSortIcon(header.key)}
                  </button>
                ) : (
                  header.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950/50">
          {ingresos.map((ingreso) => (
            <tr key={ingreso.id} className="hover:bg-emerald-50/60 dark:hover:bg-gray-900/40">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{formatDate(ingreso.fecha_llegada)}</td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{ingreso.nombre_producto}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{ingreso.categoria}</td>
              <td className="px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-200">{ingreso.tipo_seccion}</td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{ingreso.stock_ingresado}</td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{currency.format(ingreso.costo_bulto)}</td>
              <td className="px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                {currency.format(ingreso.precio_final_calculado)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{formatDate(ingreso.fecha_vencimiento)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ingresos.length === 0 && (
        <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No hay ingresos que coincidan con el filtro.</div>
      )}
    </div>
  );
}
