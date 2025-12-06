const ventas = [];

export const posService = {
  registrarVenta(venta) {
    const registro = {
      id: venta.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      ...venta
    };
    ventas.push(registro);
    return { ...registro };
  },
  getVentas() {
    return ventas.map((venta) => ({ ...venta }));
  },
  getVentaById(id) {
    return ventas.find((venta) => venta.id === id) || null;
  }
};
