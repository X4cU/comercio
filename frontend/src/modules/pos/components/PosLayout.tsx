import React from 'react';

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function PosLayout({ title = 'Point of Sale', children }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-6 py-4 flex items-center justify-between bg-slate-900 shadow">
        <div>
          <p className="text-sm text-slate-300">Caja real</p>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <div className="text-xs text-slate-400">
          {/* Espacio para usuario / caja activa */}
          Operador habilitado
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
