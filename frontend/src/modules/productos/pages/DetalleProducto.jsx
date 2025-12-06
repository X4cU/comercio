import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useProductosStore } from '../../../store/productosStore';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, getProductos } = useProductosStore();

  const producto = productos.find((p) => p.id === id);

  useEffect(() => {
    if (!producto) getProductos();
  }, [producto, getProductos]);

  if (!producto)
    return (
      <div className="card">
        <p className="text-sm text-gray-500">Cargando detalle...</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Volver
        </button>
        <Link to={`/productos/${id}/editar`} className="btn-primary">
          <PencilSquareIcon className="h-5 w-5" />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Detalle del producto</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{producto.nombre}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{producto.descripcion}</p>
            </div>
            <span className={`status-pill ${producto.estado ? 'active' : 'inactive'}`}>
              {producto.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Categoría</dt>
              <dd className="text-lg font-bold text-gray-900 dark:text-gray-50">{producto.categoria}</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Unidad</dt>
              <dd className="text-lg font-bold text-gray-900 dark:text-gray-50">{producto.unidad_medida}</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Precio</dt>
              <dd className="text-lg font-bold text-gray-900 dark:text-gray-50">${producto.precio.toFixed(2)}</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Margen</dt>
              <dd className="text-lg font-bold text-gray-900 dark:text-gray-50">{(producto.margen * 100).toFixed(0)}%</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Stock actual</dt>
              <dd className="text-lg font-bold text-gray-900 dark:text-gray-50">{producto.stock_actual}</dd>
              <p className="text-xs text-gray-500">Óptimo {producto.stock_optimo}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Vida útil</dt>
              <dd className="text-lg font-bold text-gray-900 dark:text-gray-50">{producto.vida_util_dias} días</dd>
            </div>
          </dl>
        </div>
        <div className="card space-y-3">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Imágenes</p>
          <div className="grid grid-cols-2 gap-3">
            {producto.imagenes?.map((img) => (
              <img key={img} src={img} alt={producto.nombre} className="h-28 w-full rounded-lg object-cover" />
            ))}
            {(!producto.imagenes || producto.imagenes.length === 0) && (
              <p className="text-sm text-gray-500">Sin imágenes cargadas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
