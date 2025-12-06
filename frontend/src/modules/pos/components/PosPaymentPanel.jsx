import React, { useEffect, useMemo, useState } from 'react';
import { usePosStore } from '../store/usePosStore';

const medios = ['EFECTIVO', 'DEBITO', 'CREDITO', 'TRANSFERENCIA', 'CTA.CTE.'];

export default function PosPaymentPanel({ onConfirmado, confirmSignal = 0, cancelSignal = 0 }) {
  const items = usePosStore((state) => state.items);
  const medioPago = usePosStore((state) => state.medioPago);
  const pagoRecibido = usePosStore((state) => state.pagoRecibido);
  const setMedioPago = usePosStore((state) => state.setMedioPago);
  const setPagoRecibido = usePosStore((state) => state.setPagoRecibido);
  const confirmarVenta = usePosStore((state) => state.confirmarVenta);
  const limpiarCarrito = usePosStore((state) => state.limpiarCarrito);
  const calcularTotales = usePosStore((state) => state.calcularTotales);
  const modo = usePosStore((state) => state.modo);

  const [mensaje, setMensaje] = useState('');

  const totales = useMemo(() => calcularTotales(), [items, calcularTotales]);
  const requiereMonto = medioPago === 'EFECTIVO';
  const vueltoCalculado = requiereMonto ? Math.max(0, (pagoRecibido || 0) - totales.totalFinal) : 0;

  const handleConfirmar = () => {
    try {
      setMensaje('');
      const venta = confirmarVenta();
      onConfirmado?.(venta);
      setMensaje('Venta registrada correctamente.');
    } catch (err) {
      setMensaje(err.message || 'No se pudo confirmar la venta.');
    }
  };

  const handleCancelar = () => {
    limpiarCarrito();
    setMensaje('Venta cancelada y carrito vacío.');
  };

  useEffect(() => {
    if (confirmSignal > 0) {
      handleConfirmar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmSignal]);

  useEffect(() => {
    if (cancelSignal > 0) {
      handleCancelar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelSignal]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Pago</h3>
        <span className="text-xs text-slate-400">Modo: {modo === 'SIN_ARCA' ? 'Sin ARCA' : 'Con ARCA (prep.)'}</span>
      </div>

      <div className="mt-3 space-y-3 text-sm text-slate-200">
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-emerald-400">Medio de pago</span>
          <select
            value={medioPago}
            onChange={(e) => setMedioPago(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-semibold text-white focus:border-emerald-500 focus:outline-none"
          >
            {medios.map((medio) => (
              <option key={medio} value={medio}>
                {medio}
              </option>
            ))}
          </select>
        </label>

        {requiereMonto && (
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-emerald-400">Monto entregado</span>
            <input
              type="number"
              min={0}
              value={pagoRecibido ?? ''}
              onChange={(e) => setPagoRecibido(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="0"
            />
          </label>
        )}

        {requiereMonto && (
          <div className="flex justify-between text-sm text-slate-300">
            <span>Vuelto</span>
            <span className="font-semibold text-white">${vueltoCalculado.toFixed(2)}</span>
          </div>
        )}
      </div>

      {mensaje && <p className="mt-3 text-sm text-amber-300">{mensaje}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={handleConfirmar}
          className="rounded-lg bg-emerald-600 px-4 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400"
        >
          Confirmar venta (F5)
        </button>
        <button
          onClick={handleCancelar}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-lg font-bold text-slate-100 shadow hover:bg-slate-700"
        >
          Cancelar (Esc)
        </button>
      </div>
    </div>
  );
}
