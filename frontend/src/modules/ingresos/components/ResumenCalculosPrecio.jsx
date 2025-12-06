import React from 'react';
import { BanknotesIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });

export function ResumenCalculosPrecio({
  costo_bulto = 0,
  merma_porcentaje = 0,
  unidades_por_bulto = 0,
  precio_base_calculado = 0,
  margen_porcentaje = 0,
  precio_final_calculado = 0,
  stock_ingresado = 0,
  fecha_vencimiento = ''
}) {
  return (
    <div className="card sticky top-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Resumen en vivo</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Nuevo precio de venta</h2>
        </div>
        <BanknotesIcon className="h-8 w-8 text-emerald-500" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/80">
          <p className="text-xs text-gray-500">Costo bulto</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{currency.format(Number(costo_bulto) || 0)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/80">
          <p className="text-xs text-gray-500">Merma</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{merma_porcentaje || 0}%</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/80">
          <p className="text-xs text-gray-500">Unidades/Kg por bulto</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{unidades_por_bulto || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-emerald-100 dark:bg-gray-900 dark:ring-emerald-900/40">
          <p className="text-xs text-gray-500">Precio base</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-300">{currency.format(precio_base_calculado || 0)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/80">
          <p className="text-xs text-gray-500">Margen</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{margen_porcentaje || 0}%</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:ring-emerald-900/50">
          <p className="text-xs text-gray-500">Precio final sugerido</p>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-200">
            {currency.format(precio_final_calculado || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm dark:border-gray-800">
          <p className="text-xs text-gray-500">Stock ingresado</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stock_ingresado || 0}</p>
        </div>
        <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm dark:border-gray-800">
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDaysIcon className="h-4 w-4" />
            Fecha de vencimiento
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{fecha_vencimiento || '--'}</p>
        </div>
      </div>
    </div>
  );
}
