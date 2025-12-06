import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

const categorias = ['Frutas', 'Lácteos', 'Bebidas', 'Limpieza'];

export function ProductFilters({ search, categoria, estado, onSearch, onCategoria, onEstado }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-100">
        <FunnelIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
        <span>Filtros</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>Búsqueda en vivo</span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por nombre o descripción"
            className="w-full"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Categoría</span>
          <select value={categoria} onChange={(e) => onCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Estado</span>
          <select value={estado} onChange={(e) => onEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </label>
      </div>
    </div>
  );
}
