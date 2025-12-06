const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Mapa de precios por producto
let precios = {
  'prd-1': { precioCompra: 4.5, precioVenta: 7.8, actualizadoEn: new Date().toISOString() },
  'prd-2': { precioCompra: 0.9, precioVenta: 1.5, actualizadoEn: new Date().toISOString() }
};

const normalizarNumero = (valor) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
};

export const preciosService = {
  async getPrecio(productoId) {
    await delay();
    if (!precios[productoId]) {
      precios[productoId] = { precioCompra: 0, precioVenta: 0, actualizadoEn: new Date().toISOString() };
    }
    return { ...precios[productoId] };
  },

  async setPrecio(productoId, precioCompra, precioVenta) {
    await delay();
    const compra = normalizarNumero(precioCompra);
    const venta = normalizarNumero(precioVenta);

    if (compra <= 0 || venta <= 0) {
      throw new Error('Los precios deben ser mayores a 0');
    }

    if (venta < compra) {
      throw new Error('El precio de venta no puede ser menor que el de compra');
    }

    precios[productoId] = {
      precioCompra: compra,
      precioVenta: venta,
      actualizadoEn: new Date().toISOString()
    };

    return { ...precios[productoId] };
  },

  async getAllPrecios() {
    await delay();
    return { ...precios };
  }
};

export const getPrecio = preciosService.getPrecio;
export const setPrecio = preciosService.setPrecio;
export const getAllPrecios = preciosService.getAllPrecios;
