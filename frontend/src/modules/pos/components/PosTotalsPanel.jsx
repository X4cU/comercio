import React, { useMemo } from 'react';
import { usePosStore } from '../store/usePosStore';

export default function PosTotalsPanel() {
  const items = usePosStore((state) => state.items);
  const calcularTotales = usePosStore((state) => state.calcularTotales);

  const totales = useMemo(() => calcularTotales(), [items, calcularTotales]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-white">Resumen</h3>
      <div className="mt-3 space-y-2 text-sm text-slate-200">
        <div className="flex justify-between">
          <span>Total bruto</span>
          <span>${totales.totalBruto.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-emerald-300">
          <span>Descuentos</span>
          <span>- ${totales.totalDescuento.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total neto</span>
          <span>${totales.totalNeto.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>IVA 21%</span>
          <span>${totales.totalIva.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-white shadow-inner">
        <p className="text-xs uppercase tracking-wide text-emerald-100">Total a pagar</p>
        <p className="text-3xl font-bold">${totales.totalFinal.toFixed(2)}</p>
      </div>
    </div>
  );
}
