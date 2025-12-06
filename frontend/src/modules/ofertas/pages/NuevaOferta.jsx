import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OfertaForm } from '../components/OfertaForm';
import { useOfertasStore } from '../store/useOfertasStore';

export default function NuevaOferta() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ofertasSugeridas, cargarOfertasSugeridas, agregarOferta } = useOfertasStore();
  const [productoSeleccionado, setProductoSeleccionado] = useState(location.state?.producto || null);

  useEffect(() => {
    if (ofertasSugeridas.length === 0) cargarOfertasSugeridas();
  }, [cargarOfertasSugeridas, ofertasSugeridas.length]);

  useEffect(() => {
    if (!productoSeleccionado && ofertasSugeridas.length > 0) {
      setProductoSeleccionado(ofertasSugeridas[0]);
    }
  }, [ofertasSugeridas, productoSeleccionado]);

  const opcionesProductos = useMemo(() => {
    const base = ofertasSugeridas.map((o) => ({ value: o.productoId, label: o.nombre_producto, data: o }));
    if (productoSeleccionado && !base.find((o) => o.value === productoSeleccionado.productoId)) {
      base.unshift({ value: productoSeleccionado.productoId, label: productoSeleccionado.nombre_producto, data: productoSeleccionado });
    }
    return base;
  }, [ofertasSugeridas, productoSeleccionado]);

  const handleCambioProducto = (id) => {
    const encontrado = opcionesProductos.find((o) => o.value === id);
    setProductoSeleccionado(encontrado?.data || null);
  };

  const handleSubmit = (oferta) => {
    agregarOferta(oferta);
    navigate('/ofertas/historial');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Comercial</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nueva oferta / liquidación</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define condiciones comerciales, stock afectado y vigencia de manera controlada antes de salir en sala o ecommerce.
        </p>
      </div>

      <div className="card space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Producto</label>
            <select
              value={productoSeleccionado?.productoId || ''}
              onChange={(e) => handleCambioProducto(e.target.value)}
              className="mt-1 w-full"
            >
              {opcionesProductos.length === 0 && <option>Sin sugerencias disponibles</option>}
              {opcionesProductos.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="badge">{opcionesProductos.length} candidatos</span>
            <p>Usamos stock crítico para precargar datos.</p>
          </div>
        </div>
      </div>

      {productoSeleccionado ? (
        <OfertaForm
          producto={productoSeleccionado}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/ofertas/sugeridas')}
        />
      ) : (
        <div className="card text-sm text-gray-600 dark:text-gray-300">
          No hay productos sugeridos para ofertar en este momento.
        </div>
      )}
    </div>
  );
}
