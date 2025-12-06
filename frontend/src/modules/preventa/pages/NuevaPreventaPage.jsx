import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuscadorProductoCarrito from '../components/BuscadorProductoCarrito';
import CarritoDetalle from '../components/CarritoDetalle';
import TotalesVentaPanel from '../components/TotalesVentaPanel';
import { getProductosLite } from '../../productos/services/productosService';
import { preciosService } from '../../precios/services/preciosService';
import { ofertasService } from '../../precios/services/ofertasService';
import { stockService } from '../../stock/services/stockService';
import { crearPreventa } from '../services/preventaService';

const calcularTotales = (items = []) => {
  const total_bruto = items.reduce((acc, item) => acc + Number(item.subtotal_bruto || 0), 0);
  const total_descuento = items.reduce((acc, item) => acc + Number(item.subtotal_descuento || 0), 0);
  const total_neto = total_bruto - total_descuento;
  const total_iva = total_neto * 0.21;
  return {
    total_bruto: Number(total_bruto.toFixed(2)),
    total_descuento: Number(total_descuento.toFixed(2)),
    total_neto: Number(total_neto.toFixed(2)),
    total_iva: Number(total_iva.toFixed(2))
  };
};

const seleccionarMejorOferta = (ofertas, precioBase) => {
  if (!ofertas || ofertas.length === 0) return { precioFinal: precioBase, porcentaje: 0, oferta: null };
  return ofertas.reduce(
    (mejor, oferta) => {
      const calculado = ofertasService.calcularPrecioFinal(null, oferta, precioBase);
      if (calculado.precioFinal < mejor.precioFinal) {
        return { precioFinal: calculado.precioFinal, porcentaje: calculado.porcentajeAplicado, oferta };
      }
      return mejor;
    },
    { precioFinal: precioBase, porcentaje: 0, oferta: null }
  );
};

export default function NuevaPreventaPage() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [notas, setNotas] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [estado, setEstado] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      setEstado('loading');
      try {
        const base = await getProductosLite();
        const enriquecidos = await Promise.all(
          base.map(async (producto) => {
            const precio = await preciosService.getPrecio(producto.id);
            const ofertas = await ofertasService.getOfertasPorProducto(producto.id);
            const ofertasActivas = ofertas.filter((o) => o.estado === 'activa');
            const mejor = seleccionarMejorOferta(ofertasActivas, precio.precioVenta || 0);
            const stock = stockService.getStock(producto.id, producto.stock ?? 0);
            return {
              ...producto,
              stock,
              precioUnitario: Number(precio.precioVenta || 0),
              precioOferta: mejor.oferta ? mejor.precioFinal : null,
              porcentajeOferta: mejor.porcentaje
            };
          })
        );
        setProductos(enriquecidos);
      } catch (error) {
        setMensaje({ tipo: 'error', texto: error.message });
      } finally {
        setEstado('idle');
      }
    };

    cargar();
  }, []);

  const totales = useMemo(() => calcularTotales(carrito), [carrito]);

  const construirItem = (producto, cantidad) => {
    const precio_unitario = Number(producto.precioUnitario || 0);
    const precio_oferta_aplicado =
      producto.precioOferta && producto.precioOferta < precio_unitario ? Number(producto.precioOferta) : null;
    const subtotal_bruto = precio_unitario * cantidad;
    const subtotal_descuento = precio_oferta_aplicado ? (precio_unitario - precio_oferta_aplicado) * cantidad : 0;
    const subtotal_neto = subtotal_bruto - subtotal_descuento;

    return {
      id: producto.id,
      productoId: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio_unitario,
      precio_oferta_aplicado,
      cantidad,
      subtotal_bruto,
      subtotal_descuento,
      subtotal_neto,
      stock_disponible: producto.stock
    };
  };

  const agregarAlCarrito = (producto, cantidad) => {
    setMensaje(null);
    const actual = productos.find((p) => p.id === producto.id);
    if (!actual) return;

    const cantidadNormalizada = Math.max(1, Number(cantidad) || 1);
    const existente = carrito.find((item) => item.productoId === producto.id);
    const cantidadPropuesta = (existente?.cantidad || 0) + cantidadNormalizada;

    if (cantidadPropuesta > actual.stock) {
      setMensaje({ tipo: 'error', texto: 'No puedes agregar más que el stock disponible.' });
      return;
    }

    if (existente) {
      setCarrito((prev) =>
        prev.map((item) =>
          item.productoId === producto.id ? construirItem(actual, item.cantidad + cantidadNormalizada) : item
        )
      );
    } else {
      setCarrito((prev) => [...prev, construirItem(actual, cantidadNormalizada)]);
    }
  };

  const actualizarCantidad = (itemId, cantidad) => {
    setMensaje(null);
    const cantidadNormalizada = Math.max(1, Math.floor(Number(cantidad) || 1));
    const producto = productos.find((p) => p.id === itemId);
    if (!producto) return;
    if (cantidadNormalizada > producto.stock) {
      setMensaje({ tipo: 'error', texto: 'Cantidad supera el stock disponible.' });
      return;
    }
    setCarrito((prev) => prev.map((item) => (item.productoId === itemId ? construirItem(producto, cantidadNormalizada) : item)));
  };

  const eliminarItem = (itemId) => {
    setMensaje(null);
    setCarrito((prev) => prev.filter((item) => item.productoId !== itemId));
  };

  const vaciarCarrito = () => {
    setMensaje(null);
    setCarrito([]);
  };

  const guardarPreventa = () => {
    setMensaje(null);
    if (carrito.length === 0) {
      setMensaje({ tipo: 'error', texto: 'No puedes guardar una pre-venta vacía.' });
      return;
    }
    const excedeStock = carrito.some((item) => item.cantidad > item.stock_disponible);
    if (excedeStock) {
      setMensaje({ tipo: 'error', texto: 'Revisa cantidades: hay items que superan el stock disponible.' });
      return;
    }

    const nueva = crearPreventa({
      items: carrito,
      notas
    });

    setMensaje({ tipo: 'exito', texto: 'Pre-venta guardada en memoria.' });
    setCarrito([]);
    setNotas('');
    navigate(`/preventas/guardadas/${nueva.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Ventas</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Simulador de venta / pre-venta</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Arma un carrito rápido, aplica ofertas vigentes y valida stock antes de cerrar la operación.
        </p>
      </div>

      {mensaje && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            mensaje.tipo === 'error'
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <BuscadorProductoCarrito productos={productos} onAgregar={agregarAlCarrito} />
        </div>

        <div className="space-y-3 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Carrito</h3>
            <button
              type="button"
              onClick={vaciarCarrito}
              className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              Vaciar carrito
            </button>
          </div>
          <CarritoDetalle items={carrito} onActualizarCantidad={actualizarCantidad} onEliminar={eliminarItem} editable />
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Notas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones o aclaraciones internas"
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-3 xl:col-span-1">
          <TotalesVentaPanel
            totales={totales}
            acciones={
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={guardarPreventa}
                  disabled={estado === 'loading'}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Guardar preventa
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">Se almacenará solo en memoria local.</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
