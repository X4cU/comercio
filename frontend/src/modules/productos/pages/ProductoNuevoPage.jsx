import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductoForm } from '../components/ProductoForm';
import { productosService } from '../services/productosService';
import { categoriasService } from '../../categorias/services/categoriasService';

export default function ProductoNuevoPage() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoriasService.getCategorias().then(setCategorias).catch(console.error);
  }, []);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await productosService.createProducto(data);
      navigate('/productos');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Productos</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nuevo producto</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Completa los campos para registrar un nuevo producto.</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ProductoForm categorias={categorias} onSubmit={handleSubmit} submitting={saving} />
      </div>
    </div>
  );
}
