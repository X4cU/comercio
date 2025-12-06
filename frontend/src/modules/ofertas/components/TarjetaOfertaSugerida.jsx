import React from 'react';
import { FireIcon, MegaphoneIcon, SparklesIcon } from '@heroicons/react/24/solid';

export function TarjetaOfertaSugerida({ data, onCrear }) {
  const esLiquidacion = data.dias_restantes <= 1;
  const sugerencia = esLiquidacion ? 'Liquidar' : 'Poner en oferta';
  const Icon = esLiquidacion ? FireIcon : MegaphoneIcon;
  const tone = esLiquidacion
    ? 'bg-gradient-to-r from-rose-500 to-orange-500'
    : 'bg-gradient-to-r from-amber-400 to-emerald-500';

  return (
    <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-start gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg ${tone}`}>
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{data.categoria}</p>
            <span className="status-pill active capitalize">
              {data.estado_stock === 'LIQUIDACION' ? 'Liquidación' : 'Oferta'} sugerida
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{data.nombre_producto}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {sugerencia} por vida útil en {data.dias_restantes} día{data.dias_restantes === 1 ? '' : 's'} y margen del {data.margen}%.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-200 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
              <p className="font-semibold">{data.stock_actual} / {data.stock_optimo} óptimo</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Vida útil</p>
              <p className="font-semibold">{data.dias_restantes} días restantes</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Márgen actual</p>
              <p className="font-semibold">{data.margen}%</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Última compra</p>
              <p className="font-semibold">{data.fecha_ultima_compra}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Bultos</p>
              <p className="font-semibold">{data.bultos_vendidos}/{data.bultos_comprados} vendidos</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Duración estimada</p>
              <p className="font-semibold">{data.duracion_estimada_dias || data.dias_restantes} días</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-3">
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
          <SparklesIcon className="h-4 w-4" aria-hidden />
          {sugerencia}
        </div>
        <button type="button" className="btn-primary" onClick={() => onCrear?.(data)}>
          Crear oferta
        </button>
      </div>
    </div>
  );
}

export default TarjetaOfertaSugerida;
