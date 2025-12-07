import React, { useContext, useEffect, useMemo, useState } from 'react';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { promotionsApi } from '../api/promotionsApi';
import PromotionsTable from '../components/PromotionsTable';
import PromotionFormDrawer from '../components/PromotionFormDrawer';
import { AuthContext } from '../../../context/AuthContext';

const mapResponse = (response: any) => {
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }
  return Array.isArray(response) ? response : [];
};

export const PromotionsPage: React.FC = () => {
  const { roles = [] } = useContext(AuthContext);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'all', scope: 'ALL' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const canEdit = useMemo(() => roles.includes('admin') || roles.includes('superadmin'), [roles]);
  const canDelete = useMemo(() => roles.includes('superadmin'), [roles]);
  const readOnly = useMemo(() => roles.includes('repositor') && !canEdit, [roles, canEdit]);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (filters.search) params.search = filters.search;
      if (filters.status === 'active') params.is_active = true;
      if (filters.status === 'inactive') params.is_active = false;
      if (filters.scope !== 'ALL') params.scope_type = filters.scope;

      const response = await promotionsApi.list(params);
      setPromotions(mapResponse(response));
    } catch (err: any) {
      console.error(err);
      setError('No se pudieron cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (editing?.id) {
      await promotionsApi.update(editing.id, values);
    } else {
      await promotionsApi.create(values);
    }
    await loadPromotions();
    setEditing(null);
  };

  const handleToggle = async (promotion: any) => {
    await promotionsApi.toggle(promotion.id);
    await loadPromotions();
  };

  const handleDelete = async (promotion: any) => {
    if (!window.confirm('¿Eliminar promoción? Quedará en historial (soft delete).')) return;
    await promotionsApi.remove(promotion.id);
    await loadPromotions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Promociones</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reglas comerciales generales (descuentos, 2x1, happy hours) listas para integrarse con el POS.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <PlusIcon className="h-5 w-5" /> Nueva promoción
          </button>
        )}
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-4 md:items-end">
        <label className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Buscar por nombre
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Ej: Promo verano"
          />
        </label>
        <label className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Estado
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Alcance
          <select
            value={filters.scope}
            onChange={(e) => setFilters((prev) => ({ ...prev, scope: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="ALL">Todos</option>
            <option value="GLOBAL">Global</option>
            <option value="CATEGORY">Categoría</option>
            <option value="PRODUCT">Producto</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button
            onClick={loadPromotions}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowPathIcon className="h-4 w-4" /> Actualizar
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200">{error}</div>}

      <PromotionsTable
        promotions={promotions}
        loading={loading}
        onEdit={(promo) => {
          setEditing(promo);
          setDrawerOpen(true);
        }}
        onToggle={canEdit ? handleToggle : undefined}
        onDelete={canDelete ? handleDelete : undefined}
        readOnly={readOnly}
        canDelete={canDelete}
      />

      <PromotionFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing || { valid_from: new Date().toISOString().slice(0, 16) }}
        readOnly={readOnly}
      />
    </div>
  );
};

export default PromotionsPage;
