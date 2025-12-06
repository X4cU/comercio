import React, { useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export function PrecioForm({ initialData, onSubmit, onCancel, isSaving = false }) {
  const [precioCompra, setPrecioCompra] = useState(initialData?.precioCompra ?? '');
  const [precioVenta, setPrecioVenta] = useState(initialData?.precioVenta ?? '');
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    setPrecioCompra(initialData?.precioCompra ?? '');
    setPrecioVenta(initialData?.precioVenta ?? '');
  }, [initialData]);

  const calculos = useMemo(() => {
    const compra = Number(precioCompra) || 0;
    const venta = Number(precioVenta) || 0;
    const margen = venta > 0 ? ((venta - compra) / venta) * 100 : 0;
    const markup = compra > 0 ? ((venta - compra) / compra) * 100 : 0;
    return { margen: Number(margen.toFixed(2)), markup: Number(markup.toFixed(2)) };
  }, [precioCompra, precioVenta]);

  const validar = () => {
    const mensajes = [];
    const compra = Number(precioCompra);
    const venta = Number(precioVenta);

    if (!Number.isFinite(compra) || compra <= 0) mensajes.push('El precio de compra debe ser mayor a 0');
    if (!Number.isFinite(venta) || venta <= 0) mensajes.push('El precio de venta debe ser mayor a 0');
    if (Number.isFinite(compra) && Number.isFinite(venta) && venta < compra)
      mensajes.push('El precio de venta no puede ser menor que el de compra');

    setErrores(mensajes);
    return mensajes.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onSubmit?.({ precioCompra: Number(precioCompra), precioVenta: Number(precioVenta), ...calculos });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label>Precio de compra</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={precioCompra}
            onChange={(e) => setPrecioCompra(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <label>Precio de venta</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Margen sugerido</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{calculos.margen}%</p>
          <p className="text-xs text-gray-500">Relación margen/venta</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Markup</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{calculos.markup}%</p>
          <p className="text-xs text-gray-500">Relación utilidad/compra</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-sm ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100 dark:ring-emerald-800">
          <p className="text-xs uppercase tracking-wide">Indicador</p>
          <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-100">{calculos.margen >= 10 ? 'Margen saludable' : 'Margen bajo'}</p>
          {calculos.margen < 10 && <p className="text-xs text-emerald-700 dark:text-emerald-200">Revisa el precio de venta para evitar pérdidas.</p>}
        </div>
      </div>

      {errores.length > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
          <ul className="list-disc space-y-1 pl-4">
            {errores.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={isSaving}>
          {isSaving && <ArrowPathIcon className="h-4 w-4 animate-spin" />} Guardar cambios
        </button>
      </div>
    </form>
  );
}

export default PrecioForm;
