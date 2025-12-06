const calcularEstadoStock = (item) => {
  if (item.dias_restantes <= 1) return 'LIQUIDACION';
  if (item.dias_restantes === 2) return 'OFERTA';
  if (item.stock_actual < item.stock_optimo) return 'REPOSICION';
  return 'OK';
};

const baseStock = [
  {
    id: 'stk-001',
    productoId: 'prd-001',
    nombre_producto: 'Tomates Roma',
    categoria: 'Verduras',
    stock_actual: 60,
    stock_optimo: 80,
    unidad_medida: 'kg',
    vida_util_dias: 7,
    dias_restantes: 4,
    es_perecedero: true
  },
  {
    id: 'stk-002',
    productoId: 'prd-002',
    nombre_producto: 'Lechuga Hidropónica',
    categoria: 'Verduras',
    stock_actual: 30,
    stock_optimo: 70,
    unidad_medida: 'unidad',
    vida_util_dias: 5,
    dias_restantes: 1,
    es_perecedero: true
  },
  {
    id: 'stk-003',
    productoId: 'prd-003',
    nombre_producto: 'Leche Entera 1L',
    categoria: 'Lácteos',
    stock_actual: 90,
    stock_optimo: 120,
    unidad_medida: 'unidad',
    vida_util_dias: 10,
    dias_restantes: 6,
    es_perecedero: true
  },
  {
    id: 'stk-004',
    productoId: 'prd-004',
    nombre_producto: 'Yogur Griego Natural 150g',
    categoria: 'Lácteos',
    stock_actual: 150,
    stock_optimo: 130,
    unidad_medida: 'unidad',
    vida_util_dias: 15,
    dias_restantes: 2,
    es_perecedero: true
  },
  {
    id: 'stk-005',
    productoId: 'prd-005',
    nombre_producto: 'Arroz Integral 1kg',
    categoria: 'Despensa',
    stock_actual: 300,
    stock_optimo: 250,
    unidad_medida: 'unidad',
    vida_util_dias: 540,
    dias_restantes: 365,
    es_perecedero: false
  },
  {
    id: 'stk-006',
    productoId: 'prd-006',
    nombre_producto: 'Banana Ecuador',
    categoria: 'Frutas',
    stock_actual: 40,
    stock_optimo: 90,
    unidad_medida: 'kg',
    vida_util_dias: 6,
    dias_restantes: 2,
    es_perecedero: true
  },
  {
    id: 'stk-007',
    productoId: 'prd-007',
    nombre_producto: 'Palta Hass',
    categoria: 'Frutas',
    stock_actual: 25,
    stock_optimo: 80,
    unidad_medida: 'unidad',
    vida_util_dias: 5,
    dias_restantes: 0,
    es_perecedero: true
  },
  {
    id: 'stk-008',
    productoId: 'prd-008',
    nombre_producto: 'Harina 000 1kg',
    categoria: 'Despensa',
    stock_actual: 180,
    stock_optimo: 200,
    unidad_medida: 'unidad',
    vida_util_dias: 365,
    dias_restantes: 180,
    es_perecedero: false
  }
];

export const stockMock = baseStock.map((item) => ({
  ...item,
  estado_stock: item.estado_stock || calcularEstadoStock(item)
}));
