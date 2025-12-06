import React, { useEffect, useState } from 'react';
import { PaymentPayload } from '../api/posApi';

interface Props {
  paymentMethods: string[];
  total: number;
  onChange: (payments: PaymentPayload[]) => void;
}

export default function PaymentPanel({ paymentMethods, total, onChange }: Props) {
  const [payments, setPayments] = useState<PaymentPayload[]>([]);

  useEffect(() => {
    onChange(payments);
  }, [payments, onChange]);

  const addPayment = () => {
    const method = paymentMethods[0] || 'CASH';
    setPayments((prev) => [...prev, { payment_method: method as PaymentPayload['payment_method'], amount: total }]);
  };

  const updatePayment = (index: number, field: keyof PaymentPayload, value: any) => {
    setPayments((prev) => prev.map((payment, i) => (i === index ? { ...payment, [field]: value } : payment)));
  };

  const removePayment = (index: number) => setPayments((prev) => prev.filter((_, i) => i !== index));

  const totalPaid = payments.reduce((acc, payment) => acc + Number(payment.amount || 0), 0);

  return (
    <div className="bg-slate-900 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pagos</h3>
        <button
          className="bg-emerald-500 text-white px-3 py-1 rounded text-sm"
          type="button"
          onClick={addPayment}
        >
          Agregar pago
        </button>
      </div>
      {payments.length === 0 && <p className="text-xs text-slate-400">Sin pagos cargados.</p>}
      <div className="space-y-2">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded">
            <select
              className="bg-slate-900 text-white text-sm rounded px-2 py-1 border border-slate-700"
              value={payment.payment_method}
              onChange={(e) => updatePayment(index, 'payment_method', e.target.value as PaymentPayload['payment_method'])}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="flex-1 bg-slate-900 text-white text-sm rounded px-2 py-1 border border-slate-700"
              value={payment.amount}
              onChange={(e) => updatePayment(index, 'amount', Number(e.target.value))}
            />
            <button className="text-xs text-red-400" onClick={() => removePayment(index)}>
              Quitar
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-slate-300">
        <span>Total a pagar</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-slate-300">
        <span>Total ingresado</span>
        <span>${totalPaid.toFixed(2)}</span>
      </div>
      {Math.abs(totalPaid - total) > 0.01 && (
        <p className="text-xs text-amber-400">La suma de pagos debe coincidir con el total.</p>
      )}
    </div>
  );
}
