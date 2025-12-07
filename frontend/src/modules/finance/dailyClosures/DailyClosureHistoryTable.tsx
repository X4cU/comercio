import React from 'react';
import { DailyClosure } from './dailyClosureApi';

type Props = {
  items: DailyClosure[];
  onAnnul: (id: number) => void;
  onView: (id: number) => void;
  canAnnul: boolean;
};

export function DailyClosureHistoryTable({ items, onAnnul, onView, canAnnul }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Ventas</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Costos fijos</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Utilidad</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Estado</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((closure) => (
            <tr key={closure.id}>
              <td className="px-4 py-3 text-sm text-gray-800">{closure.closure_date}</td>
              <td className="px-4 py-3 text-sm text-gray-800">${closure.total_sales.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-gray-800">${closure.total_fixed_costs.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-gray-800">${closure.gross_profit.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                    closure.status === 'ANNULLED'
                      ? 'bg-red-50 text-red-700 ring-1 ring-red-100'
                      : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                  }`}
                >
                  {closure.status === 'ANNULLED' ? 'Anulado' : 'Cerrado'}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded-lg px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    onClick={() => onView(closure.id)}
                  >
                    Ver detalle
                  </button>
                  {canAnnul && closure.status !== 'ANNULLED' && (
                    <button
                      className="rounded-lg px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                      onClick={() => onAnnul(closure.id)}
                    >
                      Anular
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
