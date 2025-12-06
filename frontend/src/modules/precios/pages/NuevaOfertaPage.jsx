import React, { useEffect, useState } from 'react';
import { getProductosLite } from '../../productos/services/productosService';
import { ofertasService } from '../services/ofertasService';
import OfertaForm from '../components/OfertaForm';

export default function NuevaOfertaPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    getProductosLite().then((lista) => {
      setProductos(lista);
      setProductoSeleccionado(lista[0] || null);
    });
  }, []);

  const handleSubmit = async (oferta) => {
    try {
      await ofertasService.crearOferta(oferta);
      setMensaje('Oferta creada correctamente');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Ofertas</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Crear nueva oferta</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configura descuentos, vigencia y validaciones antes de publicar.</p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2 space-y-2">
            <label>Producto</label>
            <select
              value={productoSeleccionado?.id || ''}
              onChange={(e) => setProductoSeleccionado(productos.find((p) => p.id === e.target.value))}
            >
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
          <div className="rounded-lg bg-emerald-50 p-3 text-sm ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100 dark:ring-emerald-800">
            <p className="text-xs uppercase tracking-wide">Estado</p>
            <p className="text-lg font-semibold">Activa o programada según fechas</p>
          </div>
        </div>

        {mensaje && <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">{mensaje}</div>}

        {productoSeleccionado ? (
          <OfertaForm
            productoSeleccionado={productoSeleccionado}
            onSubmit={(payload) => handleSubmit({ ...payload, productoId: productoSeleccionado.id })}
          />
        ) : (
          <div className="text-sm text-gray-500">No hay productos disponibles.</div>
        )}
      </div>
    </div>
  );
}
