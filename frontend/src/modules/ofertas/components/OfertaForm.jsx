import React, { useMemo, useState } from 'react';

export function OfertaForm({ producto, initialValues = {}, onSubmit, onCancel }) {
  const [tipo, setTipo] = useState(initialValues.tipo || (producto?.dias_restantes <= 1 ? 'LIQUIDACION' : 'OFERTA'));
  const [porcentaje, setPorcentaje] = useState(initialValues.porcentaje_descuento || 15);
  const [stockAfectado, setStockAfectado] = useState(initialValues.stock_afectado || producto?.stock_actual || 0);
  const [fechaInicio, setFechaInicio] = useState(initialValues.fecha_inicio || new Date().toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(initialValues.fecha_fin || '');
  const [motivo, setMotivo] = useState(initialValues.motivo || 'SOBRE-STOCK');

  const precioOriginal = initialValues.precio_original || producto?.precio_original || 0;
  const precioOferta = useMemo(() => Number((precioOriginal * (1 - porcentaje / 100)).toFixed(2)), [porcentaje, precioOriginal]);
  const margenPost = useMemo(() => {
    const margenBase = producto?.margen || 0;
    return Number(Math.max(0, margenBase - porcentaje * 0.25).toFixed(1));
  }, [producto?.margen, porcentaje]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!producto) return;
    onSubmit?.({
      ...producto,
      tipo,
      porcentaje_descuento: Number(porcentaje),
      precio_original: Number(precioOriginal),
      precio_oferta: precioOferta,
      stock_afectado: Number(stockAfectado),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || fechaInicio,
      motivo,
      estado: 'VIGENTE'
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Producto</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{producto?.nombre_producto}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{producto?.categoria}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-100">
              {producto?.estado_stock || 'Sugerido'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Fecha última compra</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{producto?.fecha_ultima_compra}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Bultos comprados / vendidos</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{producto?.bultos_comprados} / {producto?.bultos_vendidos}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Stock actual</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{producto?.stock_actual}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Margen actual</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{producto?.margen}%</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Duración estimada</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{producto?.duracion_estimada_dias} días</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Precio original</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">${precioOriginal.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="card space-y-4">
          <div>
            <label htmlFor="tipo" className="block">Tipo</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1 w-full">
              <option value="OFERTA">OFERTA</option>
              <option value="LIQUIDACION">LIQUIDACION</option>
            </select>
          </div>
          <div>
            <label htmlFor="porcentaje" className="block">Porcentaje de descuento</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                id="porcentaje"
                type="range"
                min="5"
                max="60"
                step="1"
                value={porcentaje}
                onChange={(e) => setPorcentaje(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min="0"
                max="90"
                value={porcentaje}
                onChange={(e) => setPorcentaje(Number(e.target.value))}
                className="w-20 text-center"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">%</span>
            </div>
          </div>
          <div>
            <label htmlFor="stock" className="block">Stock afectado</label>
            <input
              id="stock"
              type="number"
              value={stockAfectado}
              onChange={(e) => setStockAfectado(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inicio" className="block">Fecha inicio</label>
              <input
                id="inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="fin" className="block">Fecha fin</label>
              <input
                id="fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="motivo" className="block">Motivo</label>
            <select id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} className="mt-1 w-full">
              <option value="VENCIMIENTO">VENCIMIENTO</option>
              <option value="SOBRE-STOCK">SOBRE-STOCK</option>
              <option value="PROMOCION">PROMOCION</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
            <div>
              <p className="text-xs uppercase tracking-wide">Precio con descuento</p>
              <p className="text-xl font-bold">${precioOferta.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide">Margen estimado</p>
              <p className="text-xl font-bold">{margenPost}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar oferta
        </button>
      </div>
    </form>
  );
}

export default OfertaForm;
