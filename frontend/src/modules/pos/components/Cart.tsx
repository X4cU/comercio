import React from 'react';
import { SaleItemPayload } from '../api/posApi';

interface Props {
  items: (SaleItemPayload & { product_name?: string })[];
  onRemove: (index: number) => void;
}

export default function Cart({ items, onRemove }: Props) {
  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Carrito</h2>
        <span className="text-xs text-slate-400">{items.length} ítems</span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div key={`${item.product_id}-${index}`} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded">
            <div>
              <p className="text-sm font-semibold">{item.product_name || 'Producto'}</p>
              <p className="text-xs text-slate-400">
                Cantidad: {item.quantity} x ${item.unit_price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                {item.discount_amount ? (
                  <p className="text-xs text-amber-400">Desc: ${item.discount_amount.toFixed(2)}</p>
                ) : null}
                <p className="text-sm font-bold">${(item.unit_price * item.quantity - (item.discount_amount || 0)).toFixed(2)}</p>
              </div>
              <button
                className="text-xs text-red-300 hover:text-red-200"
                onClick={() => onRemove(index)}
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400">Agrega productos para comenzar.</p>}
      </div>
    </div>
  );
}
