import React, { useEffect, useState } from 'react';
import { getProductoByCodigoBarras } from '../../productos/services/productosService';
import { preciosService } from '../../precios/services/preciosService';
import { ofertasService } from '../../precios/services/ofertasService';
import { stockService } from '../../stock/services/stockService';
import { usePosStore } from '../store/usePosStore';

export default function PosBarcodeInput({ inputRef }) {
  const agregarItem = usePosStore((state) => state.agregarItem);
  const [barcode, setBarcode] = useState('');
  const [feedback, setFeedback] = useState('Listo para escanear (F1)');

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = barcode.trim();
    if (!code) {
      setFeedback('Ingresa un código de barras válido.');
      return;
    }
    try {
      const producto = await getProductoByCodigoBarras(code);
      if (!producto) {
        setFeedback('Producto no encontrado.');
        return;
      }
      const precio = await preciosService.getPrecio(producto.id);
      const ofertas = await ofertasService.getOfertasPorProducto(producto.id);
      const ofertaActiva = ofertas.find((o) => o.estado === 'activa');
      const precioBase = precio?.precioVenta ?? producto.precioFinal ?? producto.precioBase ?? 0;
      const calculo = ofertasService.calcularPrecioFinal(precio, ofertaActiva, precioBase);
      const stockDisponible = stockService.getStock(producto.id, producto.stock ?? 0);

      agregarItem(producto, 1, {
        precioUnitario: precioBase,
        precioFinal: calculo.precioFinal,
        ofertaActiva,
        stockDisponible
      });
      setBarcode('');
      setFeedback('Producto agregado al carrito.');
    } catch (error) {
      setFeedback(error.message || 'No se pudo agregar el producto.');
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Código de barras</label>
          <input
            ref={inputRef}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Escanear o ingresar código"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-lg text-white shadow-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400"
        >
          Agregar
        </button>
      </form>
      <p className="mt-2 text-sm text-slate-300">{feedback}</p>
    </div>
  );
}
