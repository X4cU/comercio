import React, { useContext, useEffect, useMemo, useState } from 'react';
import PosLayout from '../components/PosLayout';
import ProductSearch from '../components/ProductSearch';
import Cart from '../components/Cart';
import PaymentPanel from '../components/PaymentPanel';
import CashSessionModal from '../components/CashSessionModal';
import ReceiptView from '../components/ReceiptView';
import { usePos } from '../hooks/usePos';
import { AuthContext } from '../../../context/AuthContext';

export default function PosPage() {
  const { state, totals, addItem, removeItem, updatePayment, updateMode, updateDiscount, resetSale, openCashSession, closeCashSession, confirmSale } = usePos();
  const { roles } = useContext(AuthContext);
  const [showCashModal, setShowCashModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const discountLimit = useMemo(() => {
    if (!state.config) return 0;
    const limits = state.config.discount_limits;
    return Math.max(
      ...(roles || []).map((role: string) => (limits[role] ? Number(limits[role]) * 100 : 0)),
      0
    );
  }, [roles, state.config]);

  useEffect(() => {
    if (!state.loading && !state.cashSession) {
      setShowCashModal(true);
    }
  }, [state.loading, state.cashSession]);

  const handleAddItem = (item: any) => {
    addItem({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_amount: 0,
    });
  };

  const handleConfirmSale = async () => {
    try {
      setSubmitting(true);
      await confirmSale();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || 'No se pudo confirmar la venta');
    } finally {
      setSubmitting(false);
    }
  };

  const canConfirm = useMemo(() => {
    const paymentTotal = state.payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    return state.items.length > 0 && Math.abs(paymentTotal - totals.total) < 0.01;
  }, [state.items, state.payments, totals.total]);

  if (state.loading) {
    return (
      <PosLayout>
        <p className="text-slate-200">Cargando configuración...</p>
      </PosLayout>
    );
  }

  if (state.lastSale) {
    return (
      <PosLayout>
        <ReceiptView
          sale={state.lastSale}
          onReset={resetSale}
          legalLegend={state.config?.ticket?.legal_legend || 'Comprobante NO fiscal – No válido como factura'}
          storeName={state.config?.ticket?.store_name || 'Comercio'}
        />
      </PosLayout>
    );
  }

  return (
    <PosLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-400">Estado de caja</p>
                <p className="text-sm font-semibold">{state.cashSession ? 'Caja abierta' : 'Caja cerrada'}</p>
              </div>
              <button
                className="text-sm bg-sky-500 text-white px-3 py-1 rounded"
                onClick={() => setShowCashModal(true)}
              >
                {state.cashSession ? 'Cerrar caja' : 'Abrir caja'}
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span>Caja: {state.cashSession?.cash_register_id || 'N/D'}</span>
              <span>|</span>
              <span>Usuario: {state.cashSession?.user_id || 'Actual'}</span>
            </div>
          </div>

          <ProductSearch onAdd={handleAddItem} />
          <Cart items={state.items as any} onRemove={removeItem} />
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Totales</h3>
              <div className="flex gap-2">
                <label className="text-sm">Modo</label>
                <select
                  className="bg-slate-800 text-white text-sm rounded px-2 py-1"
                  value={state.mode}
                  onChange={(e) => updateMode(e.target.value as any)}
                >
                  <option value="INTERNAL">Ticket interno (NO fiscal)</option>
                  <option value="ARCA_STUB">Preparar factura ARCA (futuro)</option>
                </select>
              </div>
            </div>
            {state.mode === 'ARCA_STUB' && (
              <p className="text-xs text-amber-300">Integración con ARCA aún no disponible. La venta quedará marcada.</p>
            )}
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Descuento global</span>
              <input
                type="number"
                className="bg-slate-800 text-white text-sm rounded px-2 py-1 w-20 text-right"
                value={state.globalDiscountPercent}
                min={0}
                max={discountLimit}
                onChange={(e) => updateDiscount(Math.min(discountLimit, Number(e.target.value)))}
              />
              <span>{state.globalDiscountPercent}%</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
            <PaymentPanel paymentMethods={state.config?.payment_methods || []} total={totals.total} onChange={updatePayment} />
            <button
              className="w-full bg-emerald-500 text-white py-3 rounded text-lg font-semibold disabled:opacity-50"
              disabled={!canConfirm || submitting}
              onClick={handleConfirmSale}
            >
              {submitting ? 'Procesando...' : 'Confirmar venta'}
            </button>
          </div>
        </div>
      </div>

      <CashSessionModal
        isOpen={showCashModal}
        hasSession={Boolean(state.cashSession)}
        sessionId={state.cashSession?.id}
        onOpenSession={async (payload) => {
          await openCashSession(payload);
          setShowCashModal(false);
        }}
        onCloseSession={async (payload) => {
          await closeCashSession(payload);
          setShowCashModal(false);
        }}
      />
    </PosLayout>
  );
}
