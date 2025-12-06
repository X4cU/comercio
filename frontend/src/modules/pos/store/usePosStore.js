import { create } from 'zustand';
import { posService } from '../services/posService';
import { stockService } from '../../stock/services/stockService';

const round = (value) => Number(Number(value || 0).toFixed(2));
const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const recomputeItem = (item, cantidad) => {
  const qty = Math.max(1, normalizeNumber(cantidad, 1));
  const precioUnitario = normalizeNumber(item.precio_unitario, 0);
  const precioFinalUnidad = item.precio_oferta_aplicado ?? precioUnitario;
  const descuentoUnitario = Math.max(0, precioUnitario - precioFinalUnidad);
  const subtotalBruto = round(precioUnitario * qty);
  const subtotalDescuento = round(descuentoUnitario * qty);
  const subtotalNeto = round(subtotalBruto - subtotalDescuento);

  return {
    ...item,
    cantidad: qty,
    subtotal_bruto: subtotalBruto,
    subtotal_descuento: subtotalDescuento,
    subtotal_neto: subtotalNeto
  };
};

const buildItemFromProducto = (producto, cantidad, precioUnitario, precioFinal, oferta, stockDisponible) => {
  const baseItem = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${producto.id}-${Date.now()}`,
    productoId: producto.id,
    nombre: producto.nombre,
    codigo_barras: producto.codigoBarras || producto.codigo_barras || '',
    categoria: producto.categoria || producto.categoriaId || '',
    precio_unitario: round(precioUnitario),
    precio_oferta_aplicado: oferta ? round(precioFinal) : null,
    cantidad: normalizeNumber(cantidad, 1),
    stock_disponible: normalizeNumber(stockDisponible, producto.stock ?? 0)
  };

  return {
    ...baseItem,
    ...recomputeItem(
      {
        ...baseItem,
        precio_unitario: round(precioUnitario),
        precio_oferta_aplicado: oferta ? round(precioFinal) : null
      },
      cantidad
    )
  };
};

export const usePosStore = create((set, get) => ({
  items: [],
  modo: 'SIN_ARCA',
  medioPago: 'EFECTIVO',
  pagoRecibido: null,
  ventaConfirmada: null,

  setModo: (modo) => set({ modo }),
  setMedioPago: (medioPago) => set({ medioPago }),
  setPagoRecibido: (monto) => set({ pagoRecibido: monto === '' || monto === null ? null : Number(monto) }),

  agregarItem: (producto, cantidad = 1, infoPrecio = {}) => {
    const stockDisponible = normalizeNumber(
      infoPrecio.stockDisponible ?? stockService.getStock(producto.id, producto.stock ?? 0),
      producto.stock ?? 0
    );
    const precioUnitario = normalizeNumber(
      infoPrecio.precioUnitario ?? infoPrecio.precioBase ?? producto.precioFinal ?? producto.precioBase,
      0
    );
    const precioFinal = normalizeNumber(infoPrecio.precioFinal ?? precioUnitario, precioUnitario);
    const ofertaActiva = infoPrecio.ofertaActiva ?? null;
    const cantidadNormalizada = Math.max(1, normalizeNumber(cantidad, 1));

    set((state) => {
      const existente = state.items.find((item) => item.productoId === producto.id);
      const cantidadSolicitada = (existente?.cantidad || 0) + cantidadNormalizada;
      if (cantidadSolicitada > stockDisponible) {
        throw new Error('No hay stock suficiente para agregar más unidades.');
      }

      if (existente) {
        const actualizado = recomputeItem(
          {
            ...existente,
            precio_unitario: round(precioUnitario),
            precio_oferta_aplicado: ofertaActiva ? round(precioFinal) : null,
            stock_disponible: stockDisponible
          },
          cantidadSolicitada
        );
        return { items: state.items.map((item) => (item.id === existente.id ? actualizado : item)) };
      }

      const nuevo = buildItemFromProducto(
        producto,
        cantidadNormalizada,
        precioUnitario,
        precioFinal,
        ofertaActiva,
        stockDisponible
      );
      return { items: [...state.items, nuevo] };
    });
  },

  actualizarCantidad: (itemId, nuevaCantidad) => {
    const qty = normalizeNumber(nuevaCantidad, 1);
    if (qty <= 0) {
      throw new Error('La cantidad debe ser mayor a cero.');
    }

    set((state) => {
      const items = state.items.map((item) => {
        if (item.id !== itemId) return item;
        if (qty > item.stock_disponible) {
          throw new Error('No hay stock suficiente.');
        }
        return recomputeItem(item, qty);
      });
      return { items };
    });
  },

  eliminarItem: (itemId) => set((state) => ({ items: state.items.filter((item) => item.id !== itemId) })),

  limpiarCarrito: () => set({ items: [], pagoRecibido: null, ventaConfirmada: null, medioPago: 'EFECTIVO' }),

  calcularTotales: () => {
    const { items } = get();
    const acumulado = items.reduce(
      (acc, item) => {
        acc.totalBruto += normalizeNumber(item.subtotal_bruto, 0);
        acc.totalDescuento += normalizeNumber(item.subtotal_descuento, 0);
        acc.totalNeto += normalizeNumber(item.subtotal_neto, 0);
        return acc;
      },
      { totalBruto: 0, totalDescuento: 0, totalNeto: 0 }
    );
    const totalIva = round(acumulado.totalNeto * 0.21);
    const totalFinal = round(acumulado.totalNeto + totalIva);

    return {
      totalBruto: round(acumulado.totalBruto),
      totalDescuento: round(acumulado.totalDescuento),
      totalNeto: round(acumulado.totalNeto),
      totalIva,
      totalFinal
    };
  },

  confirmarVenta: () => {
    const { items, medioPago, pagoRecibido, modo, calcularTotales } = get();
    if (!items.length) {
      throw new Error('Agrega productos al carrito antes de confirmar.');
    }

    const totales = calcularTotales();
    if (medioPago === 'EFECTIVO' && (pagoRecibido ?? 0) < totales.totalFinal) {
      throw new Error('El monto entregado es insuficiente para el total.');
    }

    const venta = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      items: [...items],
      total_bruto: totales.totalBruto,
      total_descuento: totales.totalDescuento,
      total_neto: totales.totalNeto,
      total_iva: totales.totalIva,
      total_final: totales.totalFinal,
      modo,
      medio_pago: medioPago,
      pago_recibido: medioPago === 'EFECTIVO' ? Number(pagoRecibido ?? totales.totalFinal) : null,
      vuelto: medioPago === 'EFECTIVO' ? round((pagoRecibido ?? 0) - totales.totalFinal) : 0,
      fecha_hora: new Date().toISOString(),
      observaciones: ''
    };

    const registro = posService.registrarVenta(venta);
    items.forEach((item) => {
      const stockActual = stockService.getStock(item.productoId, item.stock_disponible ?? 0);
      stockService.setStock(item.productoId, Math.max(0, stockActual - item.cantidad));
    });

    set({ ventaConfirmada: registro, items: [], pagoRecibido: null });
    return registro;
  }
}));
