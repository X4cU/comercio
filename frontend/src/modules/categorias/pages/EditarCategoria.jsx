import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CategoriaForm } from '../components/CategoriaForm';
import { useCategoriasStore } from '../store/useCategoriasStore';

export default function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cargarCategorias, obtenerCategoria, actualizarCategoria } = useCategoriasStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const categoria = useMemo(() => obtenerCategoria(id), [id, obtenerCategoria]);

  const handleSubmit = (data) => {
    setSubmitting(true);
    actualizarCategoria(id, data);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/categorias');
    }, 150);
  };

  if (!categoria) {
    return (
      <div className="card space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-300">No encontramos la categoría solicitada.</p>
        <Link to="/categorias" className="btn-secondary w-fit">Volver al listado</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Categorías</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Editar categoría</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Actualiza el color, icono y estado de la categoría.</p>
      </div>
      <div className="card">
        <CategoriaForm initialData={categoria} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
