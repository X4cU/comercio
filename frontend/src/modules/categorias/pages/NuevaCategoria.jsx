import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoriaForm } from '../components/CategoriaForm';
import { useCategoriasStore } from '../store/useCategoriasStore';

export default function NuevaCategoria() {
  const navigate = useNavigate();
  const { agregarCategoria } = useCategoriasStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (data) => {
    setSubmitting(true);
    agregarCategoria(data);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/categorias');
    }, 150);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Categorías</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nueva categoría</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Define el color, icono y estado de la categoría.</p>
      </div>
      <div className="card">
        <CategoriaForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
