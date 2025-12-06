import React from 'react';
import { PurchaseSuggestionItem } from '../api/purchasingApi';

interface Props {
  items: PurchaseSuggestionItem[];
  canEdit: boolean;
  onUpdate: (itemId: number, payload: { final_qty: number; notes?: string }) => void;
}

export const SuggestionItemsTable: React.FC<Props> = ({ items, canEdit, onUpdate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Producto</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Stock actual</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Stock óptimo</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Rotación</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Sugerido</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Final</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Motivos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2 text-sm text-gray-900">{item.product?.nombre || `ID ${item.product_id}`}</td>
              <td className="px-3 py-2 text-sm text-gray-700">{item.current_stock}</td>
              <td className="px-3 py-2 text-sm text-gray-700">{item.optimal_stock}</td>
              <td className="px-3 py-2 text-sm text-gray-700">
                {item.avg_daily_sales} / {item.projected_sales_days}d
              </td>
              <td className="px-3 py-2 text-sm text-gray-700">{item.recommended_qty}</td>
              <td className="px-3 py-2 text-sm text-gray-700">
                {canEdit ? (
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-24"
                    value={item.final_qty}
                    onChange={(e) =>
                      onUpdate(item.id, {
                        final_qty: Number(e.target.value),
                        notes: item.notes || '',
                      })
                    }
                  />
                ) : (
                  item.final_qty
                )}
              </td>
              <td className="px-3 py-2 text-sm text-gray-700 space-x-1">
                {item.reason_flags?.map((flag) => (
                  <span key={flag} className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                    {flag}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
