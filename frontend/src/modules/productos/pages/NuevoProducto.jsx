import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { useProductosStore } from '../../../store/productosStore';

export default function NuevoProducto() {
  const navigate = useNavigate();
  const { agregarProducto } = useProductosStore();

  const handleSubmit = (payload) => {
    const created = agregarProducto(payload);
    navigate(`/productos/${created.id}`);
  };

  return <ProductForm mode="create" onSubmit={handleSubmit} />;
}
