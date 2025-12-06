let preventas = [];

const calcularTotales = (items = []) => {
  const total_bruto = items.reduce((acc, item) => acc + Number(item.subtotal_bruto || 0), 0);
  const total_descuento = items.reduce((acc, item) => acc + Number(item.subtotal_descuento || 0), 0);
  const total_neto = total_bruto - total_descuento;
  const total_iva = Number((total_neto * 0.21).toFixed(2));

  return {
    total_bruto: Number(total_bruto.toFixed(2)),
    total_descuento: Number(total_descuento.toFixed(2)),
    total_neto: Number(total_neto.toFixed(2)),
    total_iva
  };
};

export function crearPreventa(preventa) {
  if (!preventa?.items || preventa.items.length === 0) {
    throw new Error('La preventa debe contener al menos un ítem.');
  }

  const totales = calcularTotales(preventa.items);

  const nueva = {
    id: preventa.id || `pre-${Date.now()}`,
    items: preventa.items.map((item) => ({ ...item })),
    ...totales,
    fecha_creacion: preventa.fecha_creacion || new Date().toISOString(),
    notas: preventa.notas || ''
  };

  preventas = [nueva, ...preventas];
  return { ...nueva };
}

export function getPreventas() {
  return preventas.map((preventa) => ({ ...preventa, items: preventa.items.map((item) => ({ ...item })) }));
}

export function getPreventaById(id) {
  const encontrada = preventas.find((p) => p.id === id);
  if (!encontrada) return null;
  return { ...encontrada, items: encontrada.items.map((item) => ({ ...item })) };
}

export function resetPreventas() {
  preventas = [];
}
