import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MovimientoForm } from '../components/MovimientoForm';
import { productosService } from '../../productos/services/productosService';
import { stockService } from '../services/stockService';

export default function MovimientoNuevoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const productoPreseleccionado = location.state?.productoId || '';

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProductos = async () => {
      setLoading(true);
      try {
        const productosLite = await productosService.getProductosLite();
        const productosConStock = productosLite.map((producto) => ({
          ...producto,
          stock: stockService.getStock(producto.id, producto.stock ?? 0)
        }));
        setProductos(productosConStock);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const registro = await stockService.registrarMovimiento(payload);
      await productosService.actualizarStock(registro.productoId, registro.stockResultante);
      navigate('/stock');
    } catch (err) {
      console.error(err);
      setError(err.message || 'No se pudo guardar el movimiento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Stock</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nuevo movimiento</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Registra ingresos, egresos o ajustes con trazabilidad de motivo y responsable.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="h-64 animate-pulse rounded-lg bg-gray-50 dark:bg-gray-800" />
        ) : (
          <MovimientoForm
            productos={productos}
            initialValues={{ productoId: productoPreseleccionado }}
            onSubmit={handleSubmit}
            submitting={saving}
          />
        )}
      </div>
    </div>
  );
}
