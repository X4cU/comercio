import React, { useEffect, useState } from 'react';
import { newMerchandiseApi } from '../api/newMerchandiseApi';
import { NewMerchandiseForm } from '../components/NewMerchandiseForm';
import { BatchListTable, BatchListItem } from '../components/BatchListTable';
import { BatchPreviewCard } from '../components/BatchPreviewCard';

export default function NewMerchandisePage() {
  const [defaults, setDefaults] = useState<{ margin?: number; shrinkage?: number }>({});
  const [batches, setBatches] = useState<BatchListItem[]>([]);
  const [lastCalculation, setLastCalculation] = useState<any>(null);

  useEffect(() => {
    newMerchandiseApi.getConfig().then((data) => setDefaults(data.pricing_defaults || {}));
    loadBatches();
  }, []);

  const loadBatches = () => {
    newMerchandiseApi.listBatches().then((res) => {
      setBatches(res.data ?? res.items ?? res); // soporta paginado simple
    });
  };

  const handleSubmit = async (payload: any) => {
    const response = await newMerchandiseApi.createBatch(payload);
    setLastCalculation(response.batch);
    await loadBatches();
    alert('Mercadería registrada con éxito');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Nueva mercadería</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Cargá un nuevo lote y calculá automáticamente merma y margen sugerido.
          </p>
          <div className="mt-4">
            <NewMerchandiseForm onSubmit={handleSubmit} defaults={defaults} />
          </div>
        </div>
        <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Últimos lotes</h3>
          </div>
          <BatchListTable batches={batches} />
        </div>
      </div>
      <div className="space-y-4">
        <BatchPreviewCard
          productName={lastCalculation?.product?.nombre}
          section={lastCalculation?.section}
          arrivalDate={lastCalculation?.arrival_date}
          expirationDate={lastCalculation?.expiration_date}
          grossCost={lastCalculation?.gross_cost_per_bulk}
          shrinkage={lastCalculation?.initial_shrinkage_rate}
          margin={lastCalculation?.margin_rate}
          basePrice={lastCalculation?.base_price}
          finalPrice={lastCalculation?.final_price}
        />
      </div>
    </div>
  );
}
