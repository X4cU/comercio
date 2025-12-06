import React from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export function CategoriaCard({ categoria, onDelete }) {
  const statusClass = categoria.estado ? 'active' : 'inactive';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}
          >
            {categoria.icono || '🏷️'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {categoria.nombre}
              </h3>
              <span className={`status-pill ${statusClass}`}>
                <span className={`h-2 w-2 rounded-full ${categoria.estado ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {categoria.estado ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{categoria.descripcion}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: categoria.color, borderColor: categoria.color }} />
                Color
              </div>
              <span>Creada el {new Date(categoria.fecha_creacion).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/categorias/${categoria.id}/editar`}
            className="btn-secondary"
            title="Editar categoría"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete?.(categoria)}
            className="btn-ghost text-rose-600 hover:text-rose-700 dark:text-rose-300"
            title="Eliminar categoría"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
