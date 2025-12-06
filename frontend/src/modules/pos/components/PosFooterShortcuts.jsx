import React from 'react';
import { usePosStore } from '../store/usePosStore';

const Shortcut = ({ label, desc }) => (
  <div className="flex flex-col items-center rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-200 shadow">
    <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">{label}</span>
    <span className="mt-1 text-[11px] text-slate-300">{desc}</span>
  </div>
);

export default function PosFooterShortcuts() {
  const modo = usePosStore((state) => state.modo);
  return (
    <footer className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="flex flex-wrap gap-2">
        <Shortcut label="F1" desc="Código de barras" />
        <Shortcut label="F2" desc="Buscar producto" />
        <Shortcut label="F5" desc="Confirmar venta" />
        <Shortcut label="ESC" desc="Cancelar venta" />
      </div>
      <div className="text-right text-sm text-slate-200">
        <p className="font-semibold text-emerald-300">Comprobante NO fiscal – No válido como factura</p>
        {modo === 'CON_ARCA' && (
          <p className="text-xs text-amber-300">Cuando ARCA esté activo, este comprobante podrá ser fiscalizado.</p>
        )}
      </div>
    </footer>
  );
}
