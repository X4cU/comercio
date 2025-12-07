import React, { useEffect, useState } from 'react';
import { FixedCost, fixedCostsApi } from './fixedCostsApi';
import { FixedCostFormDrawer } from './FixedCostFormDrawer';
import { FixedCostTable } from './FixedCostTable';

export default function FixedCostsPage() {
  const [costs, setCosts] = useState<FixedCost[]>([]);
  const [summary, setSummary] = useState<{ daily_cost: number; total_monthly_costs: number; days_in_month: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<FixedCost | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listResponse, daily] = await Promise.all([fixedCostsApi.list(), fixedCostsApi.dailyTotal()]);
      setCosts(listResponse.data || []);
      setSummary(daily);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (payload: { id?: number; name: string; monthly_amount: number; is_active: boolean; notes?: string }) => {
    if (payload.id) {
      await fixedCostsApi.update(payload.id, payload);
    } else {
      await fixedCostsApi.create(payload);
    }
    setDrawerOpen(false);
    setEditing(null);
    await loadData();
  };

  const toggleActive = async (cost: FixedCost) => {
    await fixedCostsApi.update(cost.id, { is_active: !cost.is_active });
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Finanzas</p>
          <h1 className="text-2xl font-bold text-gray-900">Costos Fijos</h1>
        </div>
        <button
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          Nuevo costo fijo
        </button>
      </div>

      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">Costo mensual total</p>
          <p className="text-2xl font-bold text-gray-900">${summary?.total_monthly_costs.toFixed(2) ?? '0.00'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Costo diario estimado</p>
          <p className="text-2xl font-bold text-gray-900">${summary?.daily_cost.toFixed(2) ?? '0.00'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Días en el mes</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.days_in_month ?? '—'}</p>
        </div>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-gray-600">Cargando costos fijos...</p>
        ) : (
          <FixedCostTable
            items={costs}
            onEdit={(item) => {
              setEditing(item);
              setDrawerOpen(true);
            }}
            onToggle={toggleActive}
          />
        )}
      </div>

      <FixedCostFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        defaultValue={editing}
      />
    </div>
  );
}
