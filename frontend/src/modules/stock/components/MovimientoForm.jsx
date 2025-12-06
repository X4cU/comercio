import React, { useEffect, useMemo, useState } from 'react';
import { stockService } from '../services/stockService';

const tipoOptions = [
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'egreso', label: 'Egreso' },
  { value: 'ajuste_positivo', label: 'Ajuste positivo' },
  { value: 'ajuste_negativo', label: 'Ajuste negativo' }
];

const motivoOptions = [
  'Compra a proveedor',
  'Venta',
  'Devolución',
  'Ajuste de inventario',
  'Traslado interno',
  'Otro'
];

const formatFecha = (value) =>
  new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

export function MovimientoForm({ productos = [], initialValues = {}, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    productoId: initialValues.productoId || '',
    tipo: initialValues.tipo || '',
    cantidad: initialValues.cantidad || '',
    motivo: initialValues.motivo || '',
    motivoPersonalizado: initialValues.motivoPersonalizado || '',
    responsable: initialValues.responsable || ''
  });

  const [errors, setErrors] = useState({});
  const [fechaMovimiento] = useState(() => new Date().toISOString());

  useEffect(() => {
    if (initialValues.productoId) {
      setForm((prev) => ({ ...prev, productoId: initialValues.productoId }));
    }
  }, [initialValues.productoId]);

  const selectedProducto = useMemo(
    () => productos.find((producto) => producto.id === form.productoId),
    [form.productoId, productos]
  );

  const stockActual = useMemo(() => {
    if (!selectedProducto) return 0;
    return stockService.getStock(selectedProducto.id, selectedProducto.stock ?? 0);
  }, [selectedProducto]);

  const cantidadNumero = Number(form.cantidad) || 0;
  const stockResultante = form.tipo
    ? stockService.calcularNuevoStock(form.tipo, cantidadNumero, stockActual)
    : stockActual;

  const motivoFinal = form.motivo === 'Otro' ? form.motivoPersonalizado : form.motivo;

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.productoId) nextErrors.productoId = 'Selecciona un producto';
    if (!form.tipo) nextErrors.tipo = 'Selecciona un tipo de movimiento';

    if (!form.cantidad || cantidadNumero <= 0) {
      nextErrors.cantidad = 'La cantidad debe ser mayor a 0';
    }

    if (!motivoFinal) {
      nextErrors.motivo = 'El motivo es obligatorio';
    }

    if ((form.tipo === 'egreso' || form.tipo === 'ajuste_negativo') && stockResultante < 0) {
      nextErrors.cantidad = 'El movimiento dejaría el stock en negativo';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      productoId: form.productoId,
      productoNombre: selectedProducto?.nombre,
      productoImagen: selectedProducto?.imagen,
      tipo: form.tipo,
      cantidad: cantidadNumero,
      motivo: motivoFinal,
      responsable: form.responsable?.trim() || 'Sin responsable',
      fecha: fechaMovimiento,
      stockActual
    };

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Producto</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
                  value={form.productoId}
                  onChange={(e) => setField('productoId', e.target.value)}
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
                {errors.productoId && <p className="text-xs text-red-600">{errors.productoId}</p>}
              </div>
              {selectedProducto && (
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
                    {selectedProducto.imagen ? (
                      <img src={selectedProducto.imagen} alt={selectedProducto.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">{selectedProducto.nombre}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Stock actual: {stockActual}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tipo de movimiento</label>
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
                value={form.tipo}
                onChange={(e) => setField('tipo', e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                {tipoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.tipo && <p className="text-xs text-red-600">{errors.tipo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Cantidad</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.cantidad}
                onChange={(e) => setField('cantidad', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
                placeholder="0"
              />
              {errors.cantidad && <p className="text-xs text-red-600">{errors.cantidad}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Motivo</label>
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
                value={form.motivo}
                onChange={(e) => setField('motivo', e.target.value)}
              >
                <option value="">Selecciona un motivo</option>
                {motivoOptions.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
              {form.motivo === 'Otro' && (
                <input
                  type="text"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
                  placeholder="Describe el motivo"
                  value={form.motivoPersonalizado}
                  onChange={(e) => setField('motivoPersonalizado', e.target.value)}
                />
              )}
              {errors.motivo && <p className="text-xs text-red-600">{errors.motivo}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Responsable</label>
              <input
                type="text"
                value={form.responsable}
                onChange={(e) => setField('responsable', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-emerald-400"
                placeholder="Ej: Juan Pérez"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Resumen</p>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Impacto en stock</h4>
            <div className="space-y-2 rounded-lg bg-white p-3 text-sm shadow-inner dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Stock actual</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">{stockActual}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Movimiento</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">{form.tipo || '—'}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Stock proyectado</span>
                <span
                  className={`font-semibold ${stockResultante < 0 ? 'text-red-600 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-200'}`}
                >
                  {Number.isNaN(stockResultante) ? '—' : stockResultante}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-100">
              Fecha y hora automática: <strong>{formatFecha(fechaMovimiento)}</strong>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-gray-900"
            >
              {submitting ? 'Guardando...' : 'Guardar movimiento'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
