import React from 'react';
import clsx from 'clsx';

interface ActiveOffer {
  id: number;
  product?: { nombre: string };
  product_id: number;
  type: string;
  status: string;
  discount_percentage: number;
  old_price: number;
  new_price: number;
  affected_quantity: number;
  valid_from: string;
  valid_until: string;
}

interface Props {
  offers: ActiveOffer[];
  loading?: boolean;
  onEdit: (offer: ActiveOffer) => void;
  onCancel: (offer: ActiveOffer) => void;
  disableActions?: boolean;
}

export const ActiveOffersTable: React.FC<Props> = ({ offers, loading, onEdit, onCancel, disableActions }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800">Ofertas activas</h2>
      <p className="text-sm text-gray-500">Controlá las promociones vigentes y su vigencia.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">% Desc.</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cantidad</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vigencia</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading && (
            <tr>
              <td className="px-4 py-3 text-sm text-gray-500" colSpan={8}>
                Cargando ofertas...
              </td>
            </tr>
          )}
          {!loading && offers.length === 0 && (
            <tr>
              <td className="px-4 py-4 text-sm text-gray-500" colSpan={8}>
                No hay ofertas activas en este momento.
              </td>
            </tr>
          )}
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">{offer.product?.nombre || `Producto ${offer.product_id}`}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={clsx(
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    offer.type === 'CLEARANCE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  )}
                >
                  {offer.type === 'CLEARANCE' ? 'Liquidación' : 'Oferta'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{offer.discount_percentage}%</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <div className="flex flex-col">
                  <span className="line-through text-gray-400">${offer.old_price.toFixed(2)}</span>
                  <span className="text-emerald-700 font-semibold">${offer.new_price.toFixed(2)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{offer.affected_quantity}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <div className="flex flex-col">
                  <span>Desde: {offer.valid_from?.slice(0, 16)}</span>
                  <span>Hasta: {offer.valid_until?.slice(0, 16)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={clsx(
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    offer.status === 'CANCELED'
                      ? 'bg-gray-200 text-gray-700'
                      : offer.status === 'EXPIRED'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                  )}
                >
                  {offer.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button
                  disabled={disableActions}
                  onClick={() => onEdit(offer)}
                  className={clsx(
                    'px-3 py-2 text-xs font-medium rounded-md border',
                    disableActions ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                  )}
                >
                  Editar
                </button>
                <button
                  disabled={disableActions}
                  onClick={() => onCancel(offer)}
                  className={clsx(
                    'px-3 py-2 text-xs font-medium rounded-md border',
                    disableActions ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
                  )}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ActiveOffersTable;
