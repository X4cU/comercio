import React, { useEffect, useState } from 'react';
import { usePosStore } from '../store/usePosStore';

const commerceName = 'Supermercado Comercio';
const mockUser = 'Cajero/a - Usuario Demo';

export default function PosHeader() {
  const modo = usePosStore((state) => state.modo);
  const setModo = usePosStore((state) => state.setModo);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-start justify-between rounded-xl bg-slate-900/80 p-4 shadow-lg ring-1 ring-slate-800">
      <div>
        <p className="text-xs uppercase tracking-wider text-emerald-400">Punto de venta</p>
        <h1 className="text-2xl font-bold text-white">{commerceName}</h1>
        <p className="text-sm text-slate-300">{mockUser}</p>
        <p className="text-xs text-slate-400">{now.toLocaleString()}</p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-200">Modo de emisión</span>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-inner focus:border-emerald-500 focus:outline-none"
          >
            <option value="SIN_ARCA">Sin ARCA (ticket interno)</option>
            <option value="CON_ARCA">Con ARCA (preparar)</option>
          </select>
        </div>
        {modo === 'CON_ARCA' && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-amber-100">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <p className="text-sm font-semibold">
              Modo ARCA en preparación: la integración fiscal aún no está activa.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
