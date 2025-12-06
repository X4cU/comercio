const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let ofertas = [
  {
    id: 'of-1',
    productoId: 'prd-1',
    tipo: 'porcentaje',
    valor: 15,
    fechaInicio: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    fechaFin: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    comentario: 'Oferta de lanzamiento'
  },
  {
    id: 'of-2',
    productoId: 'prd-2',
    tipo: 'monto',
    valor: 0.2,
    fechaInicio: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    fechaFin: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    comentario: 'Campaña programada'
  }
];

const estadosOferta = (oferta) => {
  const ahora = new Date();
  const inicio = new Date(oferta.fechaInicio);
  const fin = new Date(oferta.fechaFin);

  if (fin < ahora) return 'expirada';
  if (inicio > ahora) return 'programada';
  return 'activa';
};

export const ofertasService = {
  async crearOferta(oferta) {
    await delay();
    const existe = ofertas.some(
      (o) =>
        o.productoId === oferta.productoId &&
        o.tipo === oferta.tipo &&
        Number(o.valor) === Number(oferta.valor) &&
        new Date(o.fechaInicio).toISOString() === new Date(oferta.fechaInicio).toISOString() &&
        new Date(o.fechaFin).toISOString() === new Date(oferta.fechaFin).toISOString()
    );

    if (existe) {
      throw new Error('Ya existe una oferta idéntica para este producto en ese rango de fechas');
    }

    const nueva = {
      id: crypto.randomUUID(),
      ...oferta
    };

    ofertas = [nueva, ...ofertas];
    return { ...nueva, estado: estadosOferta(nueva) };
  },

  async getOfertasActivas() {
    await delay();
    return ofertas.filter((o) => estadosOferta(o) === 'activa').map((o) => ({ ...o, estado: 'activa' }));
  },

  async getOfertasProgramadas() {
    await delay();
    return ofertas.filter((o) => estadosOferta(o) === 'programada').map((o) => ({ ...o, estado: 'programada' }));
  },

  async getOfertasExpiradas() {
    await delay();
    return ofertas.filter((o) => estadosOferta(o) === 'expirada').map((o) => ({ ...o, estado: 'expirada' }));
  },

  async getOfertasPorProducto(productoId) {
    await delay();
    return ofertas
      .filter((o) => o.productoId === productoId)
      .map((o) => ({ ...o, estado: estadosOferta(o) }))
      .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
  },

  calcularPrecioFinal(producto, oferta, precioVentaActual = null) {
    const precioBase = precioVentaActual ?? producto?.precioVenta ?? producto?.precioFinal ?? producto?.precioBase ?? 0;
    if (!oferta) return { precioFinal: precioBase, porcentajeAplicado: 0 };

    let precioFinal = precioBase;
    let porcentajeAplicado = 0;

    if (oferta.tipo === 'porcentaje') {
      porcentajeAplicado = Math.min(Number(oferta.valor) || 0, 100);
      precioFinal = precioBase - precioBase * (porcentajeAplicado / 100);
    } else {
      const rebaja = Number(oferta.valor) || 0;
      precioFinal = precioBase - rebaja;
      porcentajeAplicado = precioBase > 0 ? Math.min((rebaja / precioBase) * 100, 100) : 0;
    }

    return { precioFinal: Math.max(0, Number(precioFinal.toFixed(2))), porcentajeAplicado: Number(porcentajeAplicado.toFixed(2)) };
  }
};

export const crearOferta = ofertasService.crearOferta;
export const getOfertasActivas = ofertasService.getOfertasActivas;
export const getOfertasProgramadas = ofertasService.getOfertasProgramadas;
export const getOfertasExpiradas = ofertasService.getOfertasExpiradas;
export const getOfertasPorProducto = ofertasService.getOfertasPorProducto;
export const calcularPrecioFinal = ofertasService.calcularPrecioFinal;
