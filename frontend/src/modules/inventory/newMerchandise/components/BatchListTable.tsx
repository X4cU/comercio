import React from 'react';

export type BatchListItem = {
  id: number;
  arrival_date: string;
  expiration_date?: string | null;
  section: string;
  quantity_received: number;
  quantity_remaining: number;
  final_price: number;
  product?: { nombre?: string };
};

type Props = {
  batches: BatchListItem[];
};

export const BatchListTable: React.FC<Props> = ({ batches }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-gray-600 uppercase text-xs">
            <th className="px-3 py-2">Llegada</th>
            <th className="px-3 py-2">Producto</th>
            <th className="px-3 py-2">Sección</th>
            <th className="px-3 py-2">Vencimiento</th>
            <th className="px-3 py-2">Recibido</th>
            <th className="px-3 py-2">Restante</th>
            <th className="px-3 py-2">Precio final</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id} className="border-b border-gray-100">
              <td className="px-3 py-2">{batch.arrival_date}</td>
              <td className="px-3 py-2">{batch.product?.nombre || '-'}</td>
              <td className="px-3 py-2">{batch.section}</td>
              <td className="px-3 py-2">{batch.expiration_date || '-'}</td>
              <td className="px-3 py-2">{batch.quantity_received}</td>
              <td className="px-3 py-2">{batch.quantity_remaining}</td>
              <td className="px-3 py-2">${batch.final_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
