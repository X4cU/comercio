import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PromotionsTableProps {
  promotions: any[];
  loading?: boolean;
  onEdit?: (promotion: any) => void;
  onToggle?: (promotion: any) => void;
  onDelete?: (promotion: any) => void;
  readOnly?: boolean;
  canDelete?: boolean;
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Sin fecha fin';
  return new Date(value).toLocaleString();
};

const resolveScopeLabel = (promotion: any) => {
  if (promotion.scope_type === 'GLOBAL') return 'Toda la tienda';
  if (promotion.scope_type === 'CATEGORY') return `Categoría #${promotion.scope_id}`;
  if (promotion.scope_type === 'PRODUCT') return promotion.product?.nombre || `Producto #${promotion.scope_id}`;
  return promotion.scope_type;
};

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  promotions,
  loading = false,
  onEdit,
  onToggle,
  onDelete,
  readOnly = false,
  canDelete = false
}) => {
  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Cargando promociones...</p>;
  }

  if (!promotions?.length) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No hay promociones configuradas.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Promoción</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Alcance</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">% Desc.</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cantidad mínima</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Vigencia</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td className="px-4 py-3">
                <div className="font-semibold text-gray-900 dark:text-gray-50">{promotion.name}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Prioridad {promotion.priority ?? 1}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{resolveScopeLabel(promotion)}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{promotion.discount_value}%</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {promotion.min_quantity ? `${promotion.min_quantity}` : 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                <div>{new Date(promotion.valid_from).toLocaleString()}</div>
                <div className="text-xs text-gray-500">{formatDate(promotion.valid_until)}</div>
              </td>
              <td className="px-4 py-3">
                <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                  promotion.is_active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {promotion.is_active ? 'Activa' : 'Inactiva'}
                </div>
                {!readOnly && (
                  <div className="mt-2">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                      <input
                        type="checkbox"
                        checked={!!promotion.is_active}
                        onChange={() => onToggle?.(promotion)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Toggle
                    </label>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  {!readOnly && (
                    <button
                      onClick={() => onEdit?.(promotion)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      aria-label="Editar"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete?.(promotion)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-900/30"
                      aria-label="Eliminar"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionsTable;
