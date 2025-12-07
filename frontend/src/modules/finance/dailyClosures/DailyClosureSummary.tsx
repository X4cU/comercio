import React from 'react';
import { DailySummary } from './dailyClosureApi';

type Props = {
  summary: DailySummary | null;
};

export function DailyClosureSummary({ summary }: Props) {
  if (!summary) {
    return <p className="text-sm text-gray-600">Cargando resumen...</p>;
  }

  const closureStatus = summary.closure?.status ?? 'PENDING';
  const statusLabel = closureStatus === 'ANNULLED' ? 'Anulado' : closureStatus === 'CLOSED' ? 'Cerrado' : 'Pendiente';
  const statusStyles =
    closureStatus === 'ANNULLED'
      ? 'bg-red-50 text-red-700 ring-1 ring-red-100'
      : closureStatus === 'CLOSED'
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';

  return (
    <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-4">
      <div>
        <p className="text-sm text-gray-500">Fecha</p>
        <p className="text-2xl font-bold text-gray-900">{summary.date}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Ventas del día</p>
        <p className="text-2xl font-bold text-gray-900">${summary.total_sales.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Costo fijo diario</p>
        <p className="text-2xl font-bold text-gray-900">${summary.daily_cost.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Utilidad bruta estimada</p>
        <p className="text-2xl font-bold text-gray-900">${summary.gross_profit.toFixed(2)}</p>
      </div>
      <div className="md:col-span-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Estado del cierre</p>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
            {statusLabel}
          </span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {summary.payment_totals.map((payment) => (
            <div key={payment.payment_method} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">{payment.payment_method}</p>
              <p className="text-lg font-semibold text-gray-900">${payment.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
