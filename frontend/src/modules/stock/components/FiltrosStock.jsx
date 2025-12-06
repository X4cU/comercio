import React from 'react';
import { FunnelIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const estadoLabels = {
  '': 'Todos',
  OK: 'OK',
  REPOSICION: 'Reposición',
  OFERTA: 'Oferta',
  LIQUIDACION: 'Liquidación'
};

export function FiltrosStock({ filtros, categorias, orden, onFiltrosChange, onOrdenChange }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-100">
        <FunnelIcon className="h-5 w-5 text-emerald-500" aria-hidden />
        <span>Filtros</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span>Búsqueda</span>
          <input
            type="search"
            value={filtros.texto}
            onChange={(e) => onFiltrosChange({ texto: e.target.value })}
            placeholder="Buscar por producto"
            className="w-full"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Categoría</span>
          <select
            value={filtros.categoria}
            onChange={(e) => onFiltrosChange({ categoria: e.target.value })}
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Tipo de alerta</span>
          <select value={filtros.estado} onChange={(e) => onFiltrosChange({ estado: e.target.value })}>
            {Object.entries(estadoLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            <ArrowDownIcon className="h-4 w-4" aria-hidden />
            Ordenar por
          </span>
          <select value={orden} onChange={(e) => onOrdenChange(e.target.value)}>
            <option value="stock">Menor stock</option>
            <option value="dias">Menor días restantes</option>
          </select>
        </label>
      </div>
    </div>
  );
}
