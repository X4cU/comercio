import React, { useEffect, useState } from 'react';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import PromotionsTable from '../components/PromotionsTable';
import PromotionFormDrawer from '../components/PromotionFormDrawer';
import { Promotion, promotionsApi } from '../api/promotionsApi';

export const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promotionsApi.getPromotions();
      setPromotions(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las promociones.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedPromotion(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (promotion: Promotion) => {
    setDrawerMode('edit');
    setSelectedPromotion(promotion);
    setDrawerOpen(true);
  };

  const handleDelete = async (promotion: Promotion) => {
    const confirmed = window.confirm('¿Eliminar o desactivar esta promoción?');
    if (!confirmed) return;
    try {
      await promotionsApi.deletePromotion(promotion.id);
      setError(null);
      setStatus('Promoción eliminada.');
      await fetchPromotions();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la promoción.');
    }
  };

  const handleDrawerSuccess = async (message?: string) => {
    setError(null);
    if (message) setStatus(message);
    await fetchPromotions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Promociones</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Configurá descuentos y precios promocionales.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPromotions}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Actualizar
          </button>
          <button
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" /> Crear promoción
          </button>
        </div>
      </div>

      {status && (
        <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-200">
          {status}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:bg-red-900/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <PromotionsTable promotions={promotions} loading={loading} onEdit={openEditDrawer} onDelete={handleDelete} />
      </div>

      <PromotionFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        initialData={selectedPromotion}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
};

export default PromotionsPage;
