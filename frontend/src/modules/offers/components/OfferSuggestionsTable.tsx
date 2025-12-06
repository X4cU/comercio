import React from 'react';
import clsx from 'clsx';

interface Suggestion {
  product_id: number;
  name: string;
  current_price: number;
  stock_current: number;
  last_purchase_date?: string;
  total_purchased_units?: number;
  total_sold_units?: number;
  estimated_shelf_life_days?: number;
  remaining_days?: number;
  suggested_type: string;
}

interface Props {
  suggestions: Suggestion[];
  loading?: boolean;
  onCreate: (suggestion: Suggestion) => void;
  disableActions?: boolean;
}

export const OfferSuggestionsTable: React.FC<Props> = ({ suggestions, loading, onCreate, disableActions }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Sugerencias automáticas</h2>
        <p className="text-sm text-gray-500">Productos perecederos que deberían ir a oferta o liquidación.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Última compra</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rotación</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Días restantes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sugerencia</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500" colSpan={7}>
                  Calculando sugerencias...
                </td>
              </tr>
            )}
            {!loading && suggestions.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-gray-500" colSpan={7}>
                  No hay productos candidatos por ahora.
                </td>
              </tr>
            )}
            {suggestions.map((item) => (
              <tr key={item.product_id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">Precio actual: ${item.current_price.toFixed(2)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.stock_current}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.last_purchase_date || 'N/D'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Comprado {item.total_purchased_units ?? 0} / Vendido {item.total_sold_units ?? 0}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.remaining_days ?? 'N/D'}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={clsx(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      item.suggested_type === 'CLEARANCE'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {item.suggested_type === 'CLEARANCE' ? 'Liquidación' : 'Oferta'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={disableActions}
                    onClick={() => onCreate(item)}
                    className={clsx(
                      'px-3 py-2 text-sm font-medium rounded-md border',
                      disableActions
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    )}
                  >
                    {item.suggested_type === 'CLEARANCE' ? 'Crear liquidación' : 'Crear oferta'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferSuggestionsTable;
