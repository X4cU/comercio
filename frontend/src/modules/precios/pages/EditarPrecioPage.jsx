import React, { useEffect, useState } from 'react';
import { getProductosLite } from '../../productos/services/productosService';
import { preciosService } from '../services/preciosService';
import PrecioForm from '../components/PrecioForm';

export default function EditarPrecioPage() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [precioActual, setPrecioActual] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    getProductosLite().then((lista) => {
      setProductos(lista);
      if (lista.length > 0) {
        setProductoId(lista[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!productoId) return;
    preciosService.getPrecio(productoId).then((p) => setPrecioActual(p));
  }, [productoId]);

  const handleSubmit = async (payload) => {
    try {
      const actualizado = await preciosService.setPrecio(productoId, payload.precioCompra, payload.precioVenta);
      setPrecioActual(actualizado);
      setMensaje('Precio guardado correctamente');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const productoSeleccionado = productos.find((p) => p.id === productoId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Precios</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Editar precios por producto</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Control de compra, venta y márgenes recomendados.</p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2 space-y-2">
            <label>Producto</label>
            <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {productoSeleccionado && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{productoSeleccionado.categoria || 'Sin categoría'}</p>
            )}
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Margen sugerido</p>
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-100">Venta ≥ Compra</p>
          </div>
        </div>

        {mensaje && <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">{mensaje}</div>}

        <PrecioForm initialData={precioActual} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
