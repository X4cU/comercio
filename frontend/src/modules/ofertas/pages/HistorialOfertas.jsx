import React, { useEffect, useMemo } from 'react';
import { ChartBarIcon, ClockIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { useOfertasStore } from '../store/useOfertasStore';
import { TablaHistorialOfertas } from '../components/TablaHistorialOfertas';

const filtrosFechaOptions = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Último mes' },
  { value: 'todo', label: 'Todo' }
];

export default function HistorialOfertas() {
  const { ofertas, cargarOfertas, filtrosHistorial, setFiltrosHistorial } = useOfertasStore();

  useEffect(() => {
    if (ofertas.length === 0) cargarOfertas();
  }, [cargarOfertas, ofertas.length]);

  const ranking = useMemo(() => {
    const ordenadas = [...ofertas].sort((a, b) => b.veces_aplicada - a.veces_aplicada);
    return ordenadas.slice(0, 5);
  }, [ofertas]);

  const filtered = useMemo(() => {
    const now = new Date();
    const desde = filtrosHistorial.fecha === '7d'
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : filtrosHistorial.fecha === '30d'
        ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        : null;

    return ofertas.filter((oferta) => {
      const fechaInicio = new Date(oferta.fecha_inicio);
      const fechaValida = desde ? fechaInicio >= desde : true;
      const tipoValido = filtrosHistorial.tipo ? oferta.tipo === filtrosHistorial.tipo : true;
      const estadoValido = filtrosHistorial.estado ? oferta.estado === filtrosHistorial.estado : true;
      return fechaValida && tipoValido && estadoValido;
    });
  }, [filtrosHistorial, ofertas]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Comercial</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Historial de ofertas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualiza desempeño de promociones y liquidez, con foco en recurrencia y margen protegido.
        </p>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <FunnelIcon className="h-5 w-5 text-emerald-500" />
          Filtros
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rango de fechas</label>
            <select
              value={filtrosHistorial.fecha}
              onChange={(e) => setFiltrosHistorial({ fecha: e.target.value })}
              className="mt-1 w-full"
            >
              {filtrosFechaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
            <select
              value={filtrosHistorial.tipo}
              onChange={(e) => setFiltrosHistorial({ tipo: e.target.value })}
              className="mt-1 w-full"
            >
              <option value="">Todos</option>
              <option value="OFERTA">OFERTA</option>
              <option value="LIQUIDACION">LIQUIDACION</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
            <select
              value={filtrosHistorial.estado}
              onChange={(e) => setFiltrosHistorial({ estado: e.target.value })}
              className="mt-1 w-full"
            >
              <option value="">Todos</option>
              <option value="VIGENTE">VIGENTE</option>
              <option value="FINALIZADA">FINALIZADA</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <ClockIcon className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{filtered.length} resultados</p>
              <p className="text-xs text-gray-500">Incluye vigentes y finalizadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            <ChartBarIcon className="h-5 w-5 text-emerald-500" />
            Top productos más ofertados
          </div>
          {ranking.map((item) => {
            const max = ranking[0]?.veces_aplicada || 1;
            const width = Math.max(10, Math.round((item.veces_aplicada / max) * 100));
            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{item.nombre_producto}</p>
                  <span className="text-xs text-gray-500">{item.veces_aplicada} veces</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
          {ranking.length === 0 && <p className="text-sm text-gray-500">Sin datos de ranking todavía.</p>}
        </div>
        <div className="lg:col-span-2 space-y-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Historial</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Detalle de ofertas y liquidaciones</h2>
          </div>
          <TablaHistorialOfertas ofertas={filtered} />
        </div>
      </div>
    </div>
  );
}
