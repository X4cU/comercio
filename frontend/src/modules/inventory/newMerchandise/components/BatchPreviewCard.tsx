import React from 'react';

type Props = {
  productName?: string;
  section?: string;
  arrivalDate?: string;
  expirationDate?: string;
  grossCost?: number;
  shrinkage?: number;
  margin?: number;
  basePrice?: number;
  finalPrice?: number;
};

export const BatchPreviewCard: React.FC<Props> = ({
  productName,
  section,
  arrivalDate,
  expirationDate,
  grossCost,
  shrinkage,
  margin,
  basePrice,
  finalPrice,
}) => {
  return (
    <div className="card p-4 shadow-sm bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Vista previa</h3>
      <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
        <div>Producto: {productName || 'Seleccione un producto'}</div>
        <div>Sección: {section || '-'}</div>
        <div>Fecha llegada: {arrivalDate || '-'}</div>
        <div>Vencimiento: {expirationDate || '-'}</div>
        <div>Costo bulto: {grossCost ? `$${grossCost.toFixed(2)}` : '-'}</div>
        <div>Merma inicial: {shrinkage != null ? `${shrinkage}%` : '-'}</div>
        <div>Margen: {margin != null ? `${margin}%` : '-'}</div>
        <div className="font-semibold">Precio base: {basePrice ? `$${basePrice.toFixed(2)}` : '-'}</div>
        <div className="font-bold text-emerald-600 dark:text-emerald-300">
          Nuevo precio de venta: {finalPrice ? `$${finalPrice.toFixed(2)}` : '-'}
        </div>
      </div>
    </div>
  );
};
