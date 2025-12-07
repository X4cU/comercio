import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Switch } from '@/components/ui/Switch';
import { Promotion, PromotionEstado } from '@/modules/promotions/api/promotionsApi';

type PromotionsTableProps = {
  promotions: Promotion[];
  loading?: boolean;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
  onToggle?: (promotion: Promotion) => void;
};

const formatTypeLabel = (tipo: Promotion['tipo']) => {
  if (tipo === 'PERCENTAGE') return 'Descuento %';
  if (tipo === 'FIXED_PRICE') return 'Precio fijo';
  return tipo;
};

const formatValue = (promotion: Promotion) => {
  if (promotion.tipo === 'PERCENTAGE') {
    return promotion.valor_descuento != null ? `${promotion.valor_descuento}%` : '—';
  }
  if (promotion.tipo === 'FIXED_PRICE') {
    return promotion.precio_promocional != null ? `$${promotion.precio_promocional}` : '—';
  }
  return '—';
};

const estadoBadge = (estado?: PromotionEstado) => {
  const base = 'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold';
  if (estado === 'activa') return `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200`;
  if (estado === 'programada')
    return `${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200`;
  if (estado === 'vencida') return `${base} bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200`;
  return `${base} bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300`;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleString();
};

export const PromotionsTable: React.FC<PromotionsTableProps> = ({ promotions, loading = false, onEdit, onDelete, onToggle }) => {
  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Cargando promociones...</p>;
  }

  if (!promotions?.length) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Sin promociones.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Valor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Vigencia</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td className="px-4 py-3">
                <div className="font-semibold text-gray-900 dark:text-gray-50">{promotion.nombre}</div>
                {promotion.descripcion && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{promotion.descripcion}</p>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{formatTypeLabel(promotion.tipo)}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{formatValue(promotion)}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                <div>{formatDate(promotion.fecha_inicio)}</div>
                <div className="text-xs text-gray-500">{promotion.fecha_fin ? formatDate(promotion.fecha_fin) : 'Sin fecha fin'}</div>
              </td>
              <td className="px-4 py-3">
                <span className={estadoBadge(promotion.estado)}>{promotion.estado ?? '—'}</span>
              </td>
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 dark:border-gray-700">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Activo</span>
                    <Switch
                      checked={promotion.activo}
                      onChange={() => onToggle?.(promotion)}
                      aria-label="Activar o desactivar promoción"
                    />
                  </div>
                  <button
                    onClick={() => onEdit?.(promotion)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    aria-label="Editar"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(promotion)}
                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-900/30"
                    aria-label="Eliminar"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
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
