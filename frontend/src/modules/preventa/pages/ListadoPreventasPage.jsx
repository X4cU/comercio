import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreventas } from '../services/preventaService';
import ResumenPreventaCard from '../components/ResumenPreventaCard';

export default function ListadoPreventasPage() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();

  const preventas = getPreventas();

  const filtradas = useMemo(() => {
    return preventas.filter((p) => {
      const fecha = new Date(p.fecha_creacion);
      const coincideTexto = filtroTexto
        ? (p.notas || '').toLowerCase().includes(filtroTexto.toLowerCase()) || p.id.includes(filtroTexto)
        : true;
      const cumpleInicio = fechaInicio ? fecha >= new Date(fechaInicio) : true;
      const cumpleFin = fechaFin ? fecha <= new Date(`${fechaFin}T23:59:59`) : true;
      return coincideTexto && cumpleInicio && cumpleFin;
    });
  }, [fechaFin, fechaInicio, filtroTexto, preventas]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Ventas</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Preventas guardadas</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Consulta simulaciones previas realizadas desde el panel.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Buscar por nota</label>
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Ej: cliente frecuente, pedido especial"
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Ítems</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Total bruto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Descuento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Total neto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {filtradas.map((preventa) => (
                <tr key={preventa.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/70">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {new Date(preventa.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{preventa.items.length}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">${preventa.total_bruto.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">${preventa.total_descuento.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                    ${preventa.total_neto.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/preventas/guardadas/${preventa.id}`)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No hay preventas que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filtradas.map((preventa) => (
          <ResumenPreventaCard key={preventa.id} preventa={preventa} onVerDetalle={(p) => navigate(`/preventas/guardadas/${p.id}`)} />
        ))}
        {filtradas.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
            No hay preventas registradas.
          </div>
        )}
      </div>
    </div>
  );
}
