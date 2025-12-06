import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { useCategoriasStore } from '../store/useCategoriasStore';
import { CategoriaCard } from '../components/CategoriaCard';

export default function ListadoCategorias() {
  const { categorias, loading, cargarCategorias, eliminarCategoria } = useCategoriasStore();
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const filtradas = useMemo(() => {
    return categorias.filter((categoria) => {
      const matchesSearch =
        categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
        categoria.descripcion.toLowerCase().includes(search.toLowerCase());
      const matchesEstado = estado
        ? estado === 'activo'
          ? categoria.estado
          : !categoria.estado
        : true;
      return matchesSearch && matchesEstado;
    });
  }, [categorias, search, estado]);

  const totales = {
    total: categorias.length,
    activas: categorias.filter((c) => c.estado).length,
    inactivas: categorias.filter((c) => !c.estado).length
  };

  const handleDelete = (categoria) => {
    const confirmed = window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`);
    if (confirmed) eliminarCategoria(categoria.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Catálogo</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Categorías</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organiza tus productos por categorías, colores e íconos personalizados.
          </p>
        </div>
        <Link to="/categorias/nueva" className="btn-primary">
          <PlusCircleIcon className="h-5 w-5" />
          Nueva categoría
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="card flex items-center gap-3">
          <Squares2X2Icon className="h-8 w-8 text-emerald-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Totales</p>
            <p className="text-lg font-semibold">{totales.total} categorías</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-100 dark:ring-emerald-800" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Activas</p>
            <p className="text-lg font-semibold">{totales.activas}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 ring-2 ring-amber-200 dark:bg-amber-900/50 dark:text-amber-100 dark:ring-amber-800" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Inactivas</p>
            <p className="text-lg font-semibold">{totales.inactivas}</p>
          </div>
        </div>
      </div>

      <div className="card grid gap-3 md:grid-cols-3 md:items-end">
        <div className="space-y-1 md:col-span-2">
          <label htmlFor="buscar">Buscar</label>
          <input
            id="buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o descripción"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3">
        {filtradas.map((categoria) => (
          <CategoriaCard key={categoria.id} categoria={categoria} onDelete={handleDelete} />
        ))}
        {!loading && filtradas.length === 0 && (
          <div className="card text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron categorías con los filtros aplicados.
          </div>
        )}
        {loading && <p className="text-sm text-gray-500">Cargando categorías...</p>}
      </div>
    </div>
  );
}
