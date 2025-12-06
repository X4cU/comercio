import React from 'react';
import { PurchaseSuggestion } from '../api/purchasingApi';

interface Props {
  suggestion?: PurchaseSuggestion | null;
  canEdit: boolean;
  onGenerate: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SuggestionHeader: React.FC<Props> = ({ suggestion, canEdit, onGenerate, onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div>
        <p className="text-sm text-gray-500">Fecha de referencia</p>
        <p className="text-xl font-semibold text-gray-900">{suggestion?.reference_date ?? 'Sin generar'}</p>
        {suggestion && (
          <p className="text-sm text-gray-600">
            Estado: <span className="font-semibold">{suggestion.status}</span>
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onGenerate}
          className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Generar nueva sugerencia
        </button>
        {suggestion && canEdit && suggestion.status === 'DRAFT' && (
          <>
            <button
              onClick={onConfirm}
              className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Confirmar lista de compra
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
