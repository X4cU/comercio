import React from 'react';

interface Props {
  sale: any;
  onReset: () => void;
  legalLegend: string;
  storeName: string;
}

export default function ReceiptView({ sale, onReset, legalLegend, storeName }: Props) {
  if (!sale) return null;

  const payments = sale.payments || [];
  const items = sale.items || [];

  return (
    <div className="bg-white text-slate-900 p-6 rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-center">{storeName}</h2>
      <p className="text-center text-sm text-slate-600">Venta {sale.sale_number}</p>
      <p className="text-center text-sm text-slate-600">{new Date(sale.created_at || Date.now()).toLocaleString()}</p>
      <div className="mt-4 divide-y divide-slate-200">
        {items.map((item: any, index: number) => (
          <div key={index} className="py-2 flex justify-between text-sm">
            <div>
              <p className="font-semibold">{item.product_name_snapshot}</p>
              <p className="text-slate-500">
                {item.quantity} x ${Number(item.unit_price).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              {item.discount_amount > 0 && <p className="text-amber-500 text-xs">Desc ${Number(item.discount_amount).toFixed(2)}</p>}
              <p className="font-semibold">${Number(item.total).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${Number(sale.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-amber-600">
          <span>Descuentos</span>
          <span>-${Number(sale.discount_total).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>Total</span>
          <span>${Number(sale.total).toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <p className="font-semibold">Pagos</p>
        {payments.map((payment: any, index: number) => (
          <div key={index} className="flex justify-between">
            <span>{payment.payment_method}</span>
            <span>${Number(payment.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500 font-semibold">{legalLegend}</p>
      <div className="flex justify-center gap-3 mt-4">
        <button className="bg-slate-900 text-white px-3 py-2 rounded" onClick={() => window.print()}>
          Imprimir
        </button>
        <button className="bg-emerald-500 text-white px-3 py-2 rounded" onClick={onReset}>
          Nueva venta
        </button>
      </div>
    </div>
  );
}
