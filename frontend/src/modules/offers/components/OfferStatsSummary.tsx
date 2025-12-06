import React, { useEffect, useState } from 'react';
import { offersApi } from '../api/offersApi';

interface StatItem {
  product_id: number;
  product_name?: string;
  offer_count: number;
  clearance_count: number;
  total_affected_quantity: number;
  avg_discount_percentage: number;
}

export const OfferStatsSummary: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await offersApi.getTopStats({ limit: 5 });
        setStats(response);
      } catch (error) {
        console.error('No se pudo cargar el resumen de ofertas', error);
      }
    };

    load();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Top productos en oferta</h3>
      <ul className="space-y-2">
        {stats.map((item) => (
          <li key={item.product_id} className="flex justify-between text-sm text-gray-700">
            <span>Producto #{item.product_id}</span>
            <span>
              Ofertas: {item.offer_count} · Liquidaciones: {item.clearance_count} · Cantidad total:{' '}
              {item.total_affected_quantity}
            </span>
          </li>
        ))}
        {stats.length === 0 && <p className="text-sm text-gray-500">Sin datos aún.</p>}
      </ul>
      <p className="mt-3 text-xs text-gray-500">Listo para conectar con el futuro gráfico de análisis.</p>
    </div>
  );
};

export default OfferStatsSummary;
