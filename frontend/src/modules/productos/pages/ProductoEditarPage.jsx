import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductoForm } from '../components/ProductoForm';
import { productosService } from '../services/productosService';
import { categoriasService } from '../../categorias/services/categoriasService';

export default function ProductoEditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [categoriasData, productoData] = await Promise.all([
          categoriasService.getCategorias(),
          productosService.getProductoById(id)
        ]);
        setCategorias(categoriasData);
        setProducto(productoData);
      } catch (err) {
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await productosService.updateProducto(id, data);
      navigate('/productos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-300">Cargando producto...</p>;
  }

  if (!producto || error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
        {error || 'Producto no encontrado'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Productos</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Editar producto</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Actualiza los datos y guarda para aplicar los cambios.</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ProductoForm
          initialData={producto}
          categorias={categorias}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      </div>
    </div>
  );
}
