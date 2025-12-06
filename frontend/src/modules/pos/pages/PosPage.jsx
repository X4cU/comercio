import React, { useEffect, useRef, useState } from 'react';
import PosHeader from '../components/PosHeader';
import PosBarcodeInput from '../components/PosBarcodeInput';
import PosProductSearchModal from '../components/PosProductSearchModal';
import PosCartTable from '../components/PosCartTable';
import PosTotalsPanel from '../components/PosTotalsPanel';
import PosPaymentPanel from '../components/PosPaymentPanel';
import PosFooterShortcuts from '../components/PosFooterShortcuts';
import { usePosStore } from '../store/usePosStore';

export default function PosPage() {
  const items = usePosStore((state) => state.items);
  const agregarItem = usePosStore((state) => state.agregarItem);
  const limpiarCarrito = usePosStore((state) => state.limpiarCarrito);
  const ventaConfirmada = usePosStore((state) => state.ventaConfirmada);

  const [searchOpen, setSearchOpen] = useState(false);
  const [confirmSignal, setConfirmSignal] = useState(0);
  const [cancelSignal, setCancelSignal] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const barcodeRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'F1') {
        event.preventDefault();
        barcodeRef.current?.focus();
      }
      if (event.key === 'F2') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'F5') {
        event.preventDefault();
        if (items.length) {
          setConfirmSignal((s) => s + 1);
        }
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        if (searchOpen) {
          setSearchOpen(false);
        } else {
          setCancelSignal((s) => s + 1);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items.length, searchOpen]);

  const handleAddFromModal = (producto, cantidad, infoPrecio) => {
    try {
      agregarItem(producto, cantidad, infoPrecio);
      setMensaje('Producto agregado.');
    } catch (err) {
      setMensaje(err.message || 'No se pudo agregar el producto.');
    }
  };

  const handleVentaConfirmada = () => {
    setMensaje('Venta confirmada y guardada.');
  };

  const handleCancelGlobal = () => {
    limpiarCarrito();
    setMensaje('Venta cancelada.');
  };

  useEffect(() => {
    if (cancelSignal > 0) {
      handleCancelGlobal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelSignal]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <PosHeader />
        {mensaje && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
            {mensaje}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <PosBarcodeInput inputRef={barcodeRef} />
            <PosCartTable />
          </div>
          <div className="flex flex-col gap-3">
            <PosTotalsPanel />
            <PosPaymentPanel
              onConfirmado={handleVentaConfirmada}
              confirmSignal={confirmSignal}
              cancelSignal={cancelSignal}
            />
            {ventaConfirmada && (
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-200">
                <p className="font-semibold text-emerald-300">Última venta</p>
                <p>ID: {ventaConfirmada.id}</p>
                <p>Monto: ${ventaConfirmada.total_final.toFixed(2)}</p>
                <p>Modo: {ventaConfirmada.modo}</p>
              </div>
            )}
          </div>
        </div>
        <PosFooterShortcuts />
      </div>

      <PosProductSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onAdd={handleAddFromModal}
      />
    </div>
  );
}
