import React, { useEffect, useState } from 'react';
import { FixedCost } from './fixedCostsApi';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { id?: number; name: string; monthly_amount: number; is_active: boolean; notes?: string }) => Promise<void>;
  defaultValue?: FixedCost | null;
};

export function FixedCostFormDrawer({ open, onClose, onSubmit, defaultValue }: Props) {
  const [name, setName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setName(defaultValue.name);
      setMonthlyAmount(defaultValue.monthly_amount);
      setIsActive(defaultValue.is_active);
      setNotes(defaultValue.notes || '');
    } else {
      setName('');
      setMonthlyAmount(0);
      setIsActive(true);
      setNotes('');
    }
  }, [defaultValue]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit({
      id: defaultValue?.id,
      name,
      monthly_amount: Number(monthlyAmount),
      is_active: isActive,
      notes: notes || undefined,
    });
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-md bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {defaultValue ? 'Editar costo fijo' : 'Nuevo costo fijo'}
          </h2>
          <button className="text-sm text-gray-500 hover:text-gray-800" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Monto mensual</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Activo
            </label>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notas</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={notes}
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
