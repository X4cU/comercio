import React, { useState } from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { usePosStore } from '../store/usePosStore';

export default function PosCartTable() {
  const items = usePosStore((state) => state.items);
  const actualizarCantidad = usePosStore((state) => state.actualizarCantidad);
  const eliminarItem = usePosStore((state) => state.eliminarItem);
  const [error, setError] = useState('');

  const onChangeCantidad = (item, delta) => {
    try {
      setError('');
      const nextCantidad = item.cantidad + delta;
      actualizarCantidad(item.id, nextCantidad);
    } catch (err) {
      setError(err.message);
    }
  };

  const onCantidadInput = (item, value) => {
    try {
      setError('');
      actualizarCantidad(item.id, Number(value));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Carrito</h3>
        {error && <p className="text-sm text-amber-400">{error}</p>}
      </div>
      <div className="flex-1 overflow-auto rounded-lg bg-slate-950/50">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="sticky top-0 bg-slate-950/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Código</th>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-center">Cantidad</th>
              <th className="px-3 py-2 text-right">Precio</th>
              <th className="px-3 py-2 text-right">Desc.</th>
              <th className="px-3 py-2 text-right">Subtotal</th>
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const precioFinalUnidad = item.precio_oferta_aplicado ?? item.precio_unitario;
              const descuentoUnitario = Math.max(0, item.precio_unitario - precioFinalUnidad);
              const tieneOferta = Boolean(item.precio_oferta_aplicado);
              return (
                <tr
                  key={item.id}
                  className={`border-b border-slate-800 ${tieneOferta ? 'bg-emerald-500/5' : 'bg-transparent'}`}
                >
                  <td className="px-3 py-2 text-xs text-slate-400">{item.codigo_barras || '—'}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{item.nombre}</span>
                      {tieneOferta && (
                        <span className="rounded-full bg-emerald-600/40 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-100">
                          Oferta
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Stock disponible: {item.stock_disponible}</p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onChangeCantidad(item, -1)}
                        className="rounded-lg bg-slate-800 p-1 text-slate-200 hover:bg-slate-700"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.cantidad}
                        onChange={(e) => onCantidadInput(item, e.target.value)}
                        className="w-16 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-center text-white focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        onClick={() => onChangeCantidad(item, 1)}
                        className="rounded-lg bg-slate-800 p-1 text-slate-200 hover:bg-slate-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">${item.precio_unitario.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-emerald-300">${descuentoUnitario.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-white">${item.subtotal_neto.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="rounded-lg bg-red-600/80 p-2 text-white shadow hover:bg-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {!items.length && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-400">
                  No hay productos en el carrito.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
