import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

interface FormValues {
  product_id?: number;
  type: 'PROMO' | 'CLEARANCE';
  discount_percentage: number;
  affected_quantity: number;
  valid_from: string;
  valid_until: string;
  notes?: string;
  old_price?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void> | void;
  productName?: string;
  initialValues?: Partial<FormValues>;
  currentPrice?: number;
  maxQuantity?: number;
  readOnly?: boolean;
}

const defaultValues: FormValues = {
  type: 'PROMO',
  discount_percentage: 10,
  affected_quantity: 1,
  valid_from: new Date().toISOString().slice(0, 16),
  valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
};

export const OfferFormDrawer: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  productName,
  initialValues,
  currentPrice = 0,
  maxQuantity,
  readOnly
}) => {
  const [form, setForm] = useState<FormValues>({ ...defaultValues });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...defaultValues, ...initialValues });
    }
  }, [open, initialValues]);

  const newPrice = useMemo(() => {
    const discount = Number(form.discount_percentage) || 0;
    const base = form.old_price ?? currentPrice;
    return Math.max(base - base * (discount / 100), 0);
  }, [form.discount_percentage, form.old_price, currentPrice]);

  const handleChange = (key: keyof FormValues, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={clsx('fixed inset-0 z-30', open ? 'block' : 'hidden')}>
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{initialValues?.type === 'CLEARANCE' ? 'Liquidación' : 'Oferta'} para</h3>
            <p className="text-sm text-gray-600">{productName}</p>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value as FormValues['type'])}
              className="mt-1 w-full border rounded-md px-3 py-2"
              disabled={readOnly}
            >
              <option value="PROMO">Oferta</option>
              <option value="CLEARANCE">Liquidación</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">% Descuento</label>
              <input
                type="number"
                min={1}
                max={90}
                value={form.discount_percentage}
                onChange={(e) => handleChange('discount_percentage', Number(e.target.value))}
                className="mt-1 w-full border rounded-md px-3 py-2"
                disabled={readOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad afectada</label>
              <input
                type="number"
                min={0}
                step={0.001}
                value={form.affected_quantity}
                onChange={(e) => handleChange('affected_quantity', Number(e.target.value))}
                className="mt-1 w-full border rounded-md px-3 py-2"
                disabled={readOnly}
              />
              {maxQuantity && (
                <p className="text-xs text-gray-500 mt-1">Stock disponible: {maxQuantity}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vigencia desde</label>
              <input
                type="datetime-local"
                value={form.valid_from}
                onChange={(e) => handleChange('valid_from', e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
                disabled={readOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vigencia hasta</label>
              <input
                type="datetime-local"
                value={form.valid_until}
                onChange={(e) => handleChange('valid_until', e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
                disabled={readOnly}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2"
              disabled={readOnly}
            />
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm text-gray-600">Precios de referencia</p>
            <div className="mt-2 flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-500">Precio actual</p>
                <p className="text-base font-semibold text-gray-900">${(form.old_price ?? currentPrice).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Precio con descuento</p>
                <p className="text-base font-semibold text-emerald-700">${newPrice.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">El POS usará este precio si la oferta está activa.</p>
          </div>
        </div>

        {!readOnly && (
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 rounded-md border" onClick={onClose}>
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferFormDrawer;
