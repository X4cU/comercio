import React from 'react';

export default function TotalesVentaPanel({ totales = {}, editable = true, acciones }) {
  const totalBruto = Number(totales.total_bruto || 0);
  const totalDescuento = Number(totales.total_descuento || 0);
  const totalNeto = Number(totales.total_neto || totalBruto - totalDescuento);
  const totalIva = Number(totales.total_iva || totalNeto * 0.21);
  const totalFinal = totalNeto + totalIva;

  const fila = (label, valor, destaque = false) => (
    <div className={`flex items-center justify-between ${destaque ? 'text-lg font-bold text-emerald-700 dark:text-emerald-200' : 'text-sm font-semibold text-gray-800 dark:text-gray-100'}`}>
      <span>{label}</span>
      <span>${valor.toFixed(2)}</span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/60 p-5 shadow-sm dark:border-emerald-900/40 dark:from-gray-900 dark:to-emerald-950/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Resumen</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Totales estimados</h3>
        </div>
        {editable && acciones}
      </div>

      <div className="mt-4 space-y-3">
        {fila('Total bruto', totalBruto)}
        {fila('Descuento', totalDescuento)}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
        {fila('Total neto', totalNeto, true)}
        {fila('IVA (21%)', totalIva)}
        <div className="rounded-xl bg-white/70 px-3 py-2 text-lg font-bold text-gray-900 ring-1 ring-emerald-100 shadow-sm dark:bg-gray-900/60 dark:text-gray-100 dark:ring-emerald-900/50">
          <div className="flex items-center justify-between">
            <span>Total con IVA</span>
            <span>${totalFinal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
