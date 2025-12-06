import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { useProductosStore } from '../../../store/productosStore';

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, getProductos, actualizarProducto } = useProductosStore();

  const producto = useMemo(() => productos.find((p) => p.id === id), [productos, id]);

  useEffect(() => {
    if (!producto) getProductos();
  }, [producto, getProductos]);

  const handleSubmit = (payload) => {
    actualizarProducto(id, payload);
    navigate(`/productos/${id}`);
  };

  if (!producto) return <p className="text-sm text-gray-500">Cargando producto...</p>;

  return <ProductForm initialData={producto} mode="edit" onSubmit={handleSubmit} />;
}
