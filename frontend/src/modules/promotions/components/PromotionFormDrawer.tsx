import React, { useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Promotion, PromotionPayload, PromotionType, promotionsApi } from '../api/promotionsApi';

type PromotionFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Promotion | null;
  onSuccess?: (message?: string) => void;
};

type FormState = {
  nombre: string;
  descripcion: string;
  tipo: PromotionType;
  valor_descuento: string;
  precio_promocional: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
};

const defaultValues: FormState = {
  nombre: '',
  descripcion: '',
  tipo: 'PERCENTAGE',
  valor_descuento: '0',
  precio_promocional: '',
  fecha_inicio: new Date().toISOString().slice(0, 16),
  fecha_fin: '',
  activo: true
};

const toInputDate = (value?: string | null) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 16);
};

export const PromotionFormDrawer: React.FC<PromotionFormDrawerProps> = ({
  open,
  onClose,
  mode,
  initialData,
  onSuccess
}) => {
  const [form, setForm] = useState<FormState>(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        nombre: initialData?.nombre ?? '',
        descripcion: initialData?.descripcion ?? '',
        tipo: initialData?.tipo ?? 'PERCENTAGE',
        valor_descuento: initialData?.valor_descuento != null ? String(initialData.valor_descuento) : '',
        precio_promocional: initialData?.precio_promocional != null ? String(initialData.precio_promocional) : '',
        fecha_inicio: toInputDate(initialData?.fecha_inicio) || defaultValues.fecha_inicio,
        fecha_fin: toInputDate(initialData?.fecha_fin),
        activo: initialData?.activo ?? true
      });
      setError(null);
    }
  }, [open, initialData]);

  const title = useMemo(() => (mode === 'edit' ? 'Editar promoción' : 'Nueva promoción'), [mode]);

  const handleChange = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (): PromotionPayload => {
    return {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      tipo: form.tipo,
      valor_descuento: form.tipo === 'PERCENTAGE' ? Number(form.valor_descuento) : null,
      precio_promocional: form.tipo === 'FIXED_PRICE' ? Number(form.precio_promocional) : null,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
      activo: form.activo
    };
  };

  const validate = () => {
    if (!form.nombre.trim()) {
      return 'El nombre es requerido.';
    }
    if (form.tipo === 'PERCENTAGE') {
      const discount = Number(form.valor_descuento);
      if (!discount || discount <= 0) return 'Ingresá un porcentaje válido.';
      if (discount > 100) return 'El descuento no puede superar el 100%.';
    }
    if (form.tipo === 'FIXED_PRICE') {
      const price = Number(form.precio_promocional);
      if (!price || price <= 0) return 'Ingresá un precio promocional válido.';
    }
    if (form.fecha_fin && form.fecha_inicio && new Date(form.fecha_fin) < new Date(form.fecha_inicio)) {
      return 'La fecha fin debe ser mayor o igual a la fecha de inicio.';
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = buildPayload();
      if (mode === 'edit' && initialData?.id) {
        await promotionsApi.updatePromotion(initialData.id, payload);
        onSuccess?.('Promoción actualizada');
      } else {
        await promotionsApi.createPromotion(payload);
        onSuccess?.('Promoción creada');
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'No se pudo guardar la promoción.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configurá promociones que el POS aplicará automáticamente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Nombre
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Tipo
              <select
                value={form.tipo}
                onChange={(e) => handleChange('tipo', e.target.value as PromotionType)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="PERCENTAGE">Descuento porcentual</option>
                <option value="FIXED_PRICE">Precio fijo</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {form.tipo === 'PERCENTAGE' && (
              <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Valor de descuento (%)
                <input
                  type="number"
                  min={1}
                  max={100}
                  step="0.01"
                  value={form.valor_descuento}
                  onChange={(e) => handleChange('valor_descuento', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </label>
            )}

            {form.tipo === 'FIXED_PRICE' && (
              <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Precio promocional
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.precio_promocional}
                  onChange={(e) => handleChange('precio_promocional', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </label>
            )}
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Estado
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => handleChange('activo', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Activa</span>
              </div>
            </label>
          </div>

          <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción (opcional)
            <textarea
              value={form.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={3}
              placeholder="Detalle la condición de la promoción"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha de inicio
              <input
                type="datetime-local"
                value={form.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Fecha de fin (opcional)
              <input
                type="datetime-local"
                value={form.fecha_fin}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Guardar promoción'}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-400">
          Las promociones se sincronizan con el POS y se aplican sólo cuando están activas y dentro del rango de fechas.
        </div>
      </div>
    </div>
  );
};

export default PromotionFormDrawer;
