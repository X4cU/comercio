import React from 'react';
import { FixedCost } from './fixedCostsApi';

type Props = {
  items: FixedCost[];
  onEdit: (item: FixedCost) => void;
  onToggle: (item: FixedCost) => void;
};

export function FixedCostTable({ items, onEdit, onToggle }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Nombre</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Monto mensual</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Notas</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((cost) => (
            <tr key={cost.id}>
              <td className="px-4 py-3 text-sm text-gray-800">{cost.name}</td>
              <td className="px-4 py-3 text-sm text-gray-800">${cost.monthly_amount.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                    cost.is_active
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                  }`}
                >
                  {cost.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{cost.notes || '—'}</td>
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded-lg px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    onClick={() => onEdit(cost)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-lg px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    onClick={() => onToggle(cost)}
                  >
                    {cost.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
