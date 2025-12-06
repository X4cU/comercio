const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let movimientos = [];
let stock = {};

const sanitizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const stockService = {
  getStock(productoId, fallback = 0) {
    const current = stock[productoId];
    if (typeof current === 'number') return current;
    stock[productoId] = sanitizeNumber(fallback, 0);
    return stock[productoId];
  },

  setStock(productoId, cantidadNueva) {
    const next = Math.max(0, sanitizeNumber(cantidadNueva, 0));
    stock[productoId] = next;
    return next;
  },

  calcularNuevoStock(tipo, cantidad, stockActual = 0) {
    const actual = sanitizeNumber(stockActual, 0);
    const delta = sanitizeNumber(cantidad, 0);
    switch (tipo) {
      case 'ingreso':
        return actual + delta;
      case 'egreso':
        return actual - delta;
      case 'ajuste_positivo':
        return actual + delta;
      case 'ajuste_negativo':
        return actual - delta;
      default:
        return actual;
    }
  },

  async registrarMovimiento(movimiento) {
    await delay();
    const { productoId, tipo, cantidad } = movimiento;
    if (!cantidad || Number(cantidad) <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    const stockActual = this.getStock(productoId, movimiento.stockActual ?? 0);
    const stockResultante = this.calcularNuevoStock(tipo, cantidad, stockActual);
    if (stockResultante < 0) {
      throw new Error('El movimiento dejaría el stock en negativo');
    }
    this.setStock(productoId, stockResultante);

    const registro = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ...movimiento,
      fecha: movimiento.fecha || new Date().toISOString(),
      stockResultante
    };

    movimientos = [registro, ...movimientos];
    return { ...registro };
  },

  async getMovimientos() {
    await delay();
    return movimientos.map((item) => ({ ...item }));
  },

  async getMovimientosPorProducto(productoId) {
    await delay();
    return movimientos.filter((item) => item.productoId === productoId).map((item) => ({ ...item }));
  }
};
