import React, { useEffect, useMemo, useState } from 'react';
import { BatchPayload } from '../api/newMerchandiseApi';

type Props = {
  onSubmit: (payload: BatchPayload) => Promise<void>;
  defaults?: { margin?: number; shrinkage?: number };
  productName?: string;
  productSection?: string;
  currentPrice?: number;
};

export const NewMerchandiseForm: React.FC<Props> = ({ onSubmit, defaults, productName, productSection, currentPrice }) => {
  const [form, setForm] = useState<BatchPayload>({
    product_id: 0,
    arrival_date: '',
    expiration_date: '',
    gross_cost_per_bulk: 0,
    bulk_units: 0,
    initial_shrinkage_rate: defaults?.shrinkage ?? 0,
    margin_rate: defaults?.margin ?? 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      initial_shrinkage_rate: defaults?.shrinkage ?? prev.initial_shrinkage_rate,
      margin_rate: defaults?.margin ?? prev.margin_rate,
    }));
  }, [defaults]);

  const handleChange = (field: keyof BatchPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculations = useMemo(() => {
    const shrinkageFactor = 1 - ((form.initial_shrinkage_rate ?? 0) / 100);
    const basePrice = form.bulk_units > 0 ? form.gross_cost_per_bulk / (form.bulk_units * shrinkageFactor) : 0;
    const finalPrice = basePrice * (1 + ((form.margin_rate ?? 0) / 100));
    const effectiveQty = form.bulk_units * shrinkageFactor;
    return { basePrice, finalPrice, effectiveQty };
  }, [form]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Producto (ID)
          <input
            type="number"
            className="input"
            value={form.product_id}
            onChange={(e) => handleChange('product_id', Number(e.target.value))}
            required
          />
          <span className="text-xs text-gray-500">Temporal: ingrese ID de producto</span>
        </label>
        <div className="text-sm text-gray-700 dark:text-gray-200">
          <div className="font-semibold">{productName || '—'}</div>
          <div>Sección: {productSection || '—'}</div>
          <div>Precio actual: {currentPrice ? `$${currentPrice.toFixed(2)}` : '—'}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Fecha de llegada
          <input
            type="date"
            className="input"
            value={form.arrival_date}
            onChange={(e) => handleChange('arrival_date', e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Fecha de vencimiento
          <input
            type="date"
            className="input"
            value={form.expiration_date ?? ''}
            onChange={(e) => handleChange('expiration_date', e.target.value)}
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Costo por bulto
          <input
            type="number"
            step="0.01"
            className="input"
            value={form.gross_cost_per_bulk}
            onChange={(e) => handleChange('gross_cost_per_bulk', Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Unidades/kilos por bulto
          <input
            type="number"
            step="0.001"
            className="input"
            value={form.bulk_units}
            onChange={(e) => handleChange('bulk_units', Number(e.target.value))}
            required
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Merma inicial (%)
          <input
            type="number"
            step="0.01"
            className="input"
            value={form.initial_shrinkage_rate ?? 0}
            onChange={(e) => handleChange('initial_shrinkage_rate', Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          Margen (%)
          <input
            type="number"
            step="0.01"
            className="input"
            value={form.margin_rate ?? 0}
            onChange={(e) => handleChange('margin_rate', Number(e.target.value))}
          />
        </label>
      </div>
      <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
        Notas
        <textarea
          className="input"
          value={form.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Observaciones"
        />
      </label>

      <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
        <div>Merma aplicada: {form.initial_shrinkage_rate ?? 0}%</div>
        <div>Unidades efectivas estimadas: {calculations.effectiveQty.toFixed(2)}</div>
        <div>Precio base: ${calculations.basePrice.toFixed(2)}</div>
        <div className="font-semibold">Precio final: ${calculations.finalPrice.toFixed(2)}</div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar mercadería'}
      </button>
    </form>
  );
};
