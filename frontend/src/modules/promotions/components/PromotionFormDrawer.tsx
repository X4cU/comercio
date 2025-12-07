import React, { useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PromotionFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void> | void;
  initialValues?: any;
  readOnly?: boolean;
}

const defaultValues = {
  name: '',
  description: '',
  scope_type: 'GLOBAL',
  scope_id: '',
  discount_value: 5,
  min_quantity: '',
  valid_from: '',
  valid_until: '',
  is_active: true,
  priority: 1
};

export const PromotionFormDrawer: React.FC<PromotionFormDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  readOnly = false
}) => {
  const [values, setValues] = useState<any>(defaultValues);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({ ...defaultValues, ...initialValues });
      setError('');
    }
  }, [open, initialValues]);

  const scopeLabel = useMemo(() => {
    if (values.scope_type === 'GLOBAL') return 'Toda la tienda';
    if (values.scope_type === 'CATEGORY') return 'Categoría específica';
    return 'Producto específico';
  }, [values.scope_type]);

  const handleChange = (field: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (Number(values.discount_value) > 100) {
      setError('El descuento no puede superar el 100%.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...values,
        scope_id: values.scope_type === 'GLOBAL' ? null : Number(values.scope_id) || null,
        min_quantity: values.min_quantity ? Number(values.min_quantity) : null,
        discount_value: Number(values.discount_value),
        priority: Number(values.priority) || 1
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'No se pudo guardar la promoción');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">{initialValues?.id ? 'Editar promoción' : 'Nueva promoción'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">La promoción se aplicará automáticamente en el POS si cumple los requisitos y está activa.</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Cerrar">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200">{error}</div>}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Nombre
              <input
                type="text"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
                disabled={readOnly}
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              % Descuento
              <input
                type="number"
                step="0.01"
                value={values.discount_value}
                onChange={(e) => handleChange('discount_value', e.target.value)}
                min={0}
                max={100}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
                disabled={readOnly}
              />
            </label>
          </div>

          <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
            <textarea
              value={values.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              rows={3}
              disabled={readOnly}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Alcance
              <select
                value={values.scope_type}
                onChange={(e) => handleChange('scope_type', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                disabled={readOnly}
              >
                <option value="GLOBAL">GLOBAL</option>
                <option value="CATEGORY">CATEGORY</option>
                <option value="PRODUCT">PRODUCT</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400">{scopeLabel}</p>
            </label>
            {values.scope_type !== 'GLOBAL' && (
              <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                {values.scope_type === 'PRODUCT' ? 'ID de producto' : 'ID de categoría'}
                <input
                  type="number"
                  value={values.scope_id || ''}
                  onChange={(e) => handleChange('scope_id', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  required
                  disabled={readOnly}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Cantidad mínima (opcional)
              <input
                type="number"
                step="0.01"
                value={values.min_quantity || ''}
                onChange={(e) => handleChange('min_quantity', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                disabled={readOnly}
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Prioridad
              <input
                type="number"
                value={values.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                min={1}
                disabled={readOnly}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Vigencia desde
              <input
                type="datetime-local"
                value={values.valid_from?.slice(0, 16) || ''}
                onChange={(e) => handleChange('valid_from', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
                disabled={readOnly}
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Vigencia hasta (opcional)
              <input
                type="datetime-local"
                value={values.valid_until?.slice(0, 16) || ''}
                onChange={(e) => handleChange('valid_until', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                disabled={readOnly}
              />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
            <div>
              <p className="font-semibold">Estado</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Activa si está habilitada y dentro de vigencia.</p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={!!values.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                disabled={readOnly}
              />
              Activa
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
            {!readOnly && (
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar promoción'}
              </button>
            )}
          </div>
        </form>

        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-400">
          Promociones generales: reglas comerciales (2x1, % de descuento, combos). Ofertas/liquidaciones perecederos: rebajas por vencimiento y urgencia de stock.
        </div>
      </div>
    </div>
  );
};

export default PromotionFormDrawer;
