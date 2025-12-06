import React, { useEffect, useMemo, useState } from 'react';
import { productosService } from '../../productos/services/productosService';
import { preciosService } from '../../precios/services/preciosService';
import { ofertasService } from '../../precios/services/ofertasService';
import { stockService } from '../../stock/services/stockService';

export default function PosProductSearchModal({ open, onClose, onAdd }) {
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    productosService
      .getProductosLite()
      .then((lista) => setProductos(lista))
      .catch(() => setError('No se pudo cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, [open]);

  const resultados = useMemo(() => {
    const term = query.toLowerCase();
    if (!term) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        (p.categoria || '').toLowerCase().includes(term) ||
        (p.subcategoria || '').toLowerCase().includes(term)
    );
  }, [productos, query]);

  const handleAdd = async () => {
    if (!selected) return;
    try {
      const productoCompleto = await productosService.getProductoById(selected.id);
      const precio = await preciosService.getPrecio(selected.id);
      const ofertas = await ofertasService.getOfertasPorProducto(selected.id);
      const ofertaActiva = ofertas.find((o) => o.estado === 'activa');
      const precioBase = precio?.precioVenta ?? productoCompleto.precioFinal ?? productoCompleto.precioBase ?? 0;
      const calculo = ofertasService.calcularPrecioFinal(precio, ofertaActiva, precioBase);
      const stockDisponible = stockService.getStock(selected.id, productoCompleto.stock ?? 0);

      onAdd(productoCompleto, cantidad, {
        precioUnitario: precioBase,
        precioFinal: calculo.precioFinal,
        ofertaActiva,
        stockDisponible
      });
      setCantidad(1);
      setSelected(null);
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo agregar el producto.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-6">
      <div className="w-full max-w-5xl rounded-2xl bg-slate-900 p-6 shadow-2xl ring-1 ring-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Buscar producto</h2>
            <p className="text-sm text-slate-300">Busca por nombre o categoría y selecciona la cantidad.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200 hover:bg-slate-700"
          >
            Cerrar (Esc)
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o categoría"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!selected}
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Agregar selección
          </button>
        </div>

        {error && <p className="mt-2 text-sm text-amber-400">{error}</p>}
        {loading && <p className="mt-4 text-sm text-slate-300">Cargando catálogo...</p>}

        <div className="mt-4 grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3 md:grid-cols-2">
          {resultados.map((producto) => (
            <button
              key={producto.id}
              type="button"
              onClick={() => setSelected(producto)}
              className={`flex gap-3 rounded-lg border px-3 py-2 text-left transition ${
                selected?.id === producto.id
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/70'
              }`}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{producto.nombre}</p>
                <p className="text-xs text-slate-400">Stock: {stockService.getStock(producto.id, producto.stock ?? 0)}</p>
                <p className="text-xs text-slate-500">{producto.categoria || 'Sin categoría'}</p>
              </div>
            </button>
          ))}
          {!resultados.length && !loading && <p className="p-3 text-sm text-slate-400">Sin resultados.</p>}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-200">Cantidad</label>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
          {selected && <p className="text-sm text-slate-300">Seleccionado: {selected.nombre}</p>}
        </div>
      </div>
    </div>
  );
}
