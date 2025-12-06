import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarritoDetalle from '../components/CarritoDetalle';
import TotalesVentaPanel from '../components/TotalesVentaPanel';
import { getPreventaById } from '../services/preventaService';

export default function SimuladorVentaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preventa, setPreventa] = useState(null);

  useEffect(() => {
    const encontrada = getPreventaById(id);
    setPreventa(encontrada);
  }, [id]);

  if (!preventa) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pre-venta no encontrada</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Verifica el identificador o selecciona otra simulación.</p>
        <button
          type="button"
          onClick={() => navigate('/preventas/guardadas')}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        Esta es una simulación guardada (pre-venta). No es un ticket fiscal.
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Ventas</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Detalle de pre-venta #{preventa.id}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Fecha: {new Date(preventa.fecha_creacion).toLocaleString()} — {preventa.notas || 'Sin notas'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CarritoDetalle items={preventa.items} editable={false} />
        </div>
        <div className="xl:col-span-2">
          <TotalesVentaPanel totales={preventa} editable={false} />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate('/preventas/guardadas')}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700"
        >
          Volver al listado
        </button>
        <button
          type="button"
          onClick={() => navigate('/preventas/simulador')}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Crear nueva simulación
        </button>
      </div>
    </div>
  );
}
