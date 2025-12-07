import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { DailyClosure, DailySummary, dailyClosureApi } from './dailyClosureApi';
import { DailyClosureSummary } from './DailyClosureSummary';
import { DailyClosureHistoryTable } from './DailyClosureHistoryTable';

export default function DailyClosurePage() {
  const { roles = [] } = useContext(AuthContext);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [history, setHistory] = useState<DailyClosure[]>([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryResp, historyResp] = await Promise.all([dailyClosureApi.getToday(), dailyClosureApi.list()]);
      setSummary(summaryResp);
      setHistory(historyResp.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    await dailyClosureApi.create({ notes: notes || undefined });
    setNotes('');
    await loadData();
  };

  const handleAnnul = async (id: number) => {
    await dailyClosureApi.annul(id);
    await loadData();
  };

  const canAnnul = roles.includes('superadmin');

  const canCreate = summary && !summary.closure;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Caja</p>
          <h1 className="text-2xl font-bold text-gray-900">Cierre Diario de Caja</h1>
        </div>
        {canCreate ? (
          <div className="flex items-center gap-2">
            <input
              placeholder="Notas (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
              onClick={handleCreate}
            >
              Generar cierre del día
            </button>
          </div>
        ) : summary?.closure ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Cierre generado
          </span>
        ) : null}
      </div>

      <DailyClosureSummary summary={summary} />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Historial de cierres</h2>
        </div>
        {loading ? (
          <p className="text-sm text-gray-600">Cargando información de caja...</p>
        ) : (
          <DailyClosureHistoryTable
            items={history}
            onAnnul={handleAnnul}
            onView={(id) => window.alert(`Detalle del cierre ${id}`)}
            canAnnul={canAnnul}
          />
        )}
      </div>
    </div>
  );
}
