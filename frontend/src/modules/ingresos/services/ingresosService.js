import axios from 'axios';
import { ingresosMock } from '../mocks/ingresosMock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const inferirTipoSeccion = (categoria = '') => {
  const cat = categoria.toLowerCase();
  if (cat.includes('verdur') || cat.includes('frut')) return 'VERDULERIA';
  if (cat.includes('fiambre') || cat.includes('láct') || cat.includes('lact')) return 'FIAMBRERIA';
  return 'DESPENSA';
};

const productosAdicionales = [
  { id: 'prd-006', nombre: 'Tomate Perita', categoria: 'Verduras', duracion_estimada_dias: 6 },
  { id: 'prd-008', nombre: 'Fideos Spaghetti 500g', categoria: 'Despensa', duracion_estimada_dias: 365 },
  { id: 'prd-009', nombre: 'Atún en lata 170g', categoria: 'Despensa', duracion_estimada_dias: 540 },
  { id: 'prd-010', nombre: 'Lechuga Crespa', categoria: 'Verduras', duracion_estimada_dias: 4 },
  { id: 'prd-011', nombre: 'Jamón Cocido Natural', categoria: 'Fiambres', duracion_estimada_dias: 12 }
];

const normalizarProductos = () => {
  const estimacionesPorCategoria = {
    verduleria: 5,
    frutas: 7,
    lácteos: 10,
    lacteos: 10,
    fiambres: 12
  };

  // SOLO usamos productosAdicionales (productosMock fue eliminado)
  const base = [...productosAdicionales];

  const unicos = base.reduce((acc, prod) => {
    if (acc.find((p) => p.id === prod.id)) return acc;

    const tipo = prod.tipo_seccion || inferirTipoSeccion(prod.categoria);
    const keyCategoria = prod.categoria?.toLowerCase?.() || '';
    const estimado =
      prod.duracion_estimada_dias ||
      prod.vida_util_dias ||
      estimacionesPorCategoria[keyCategoria] ||
      30;

    acc.push({
      id: prod.id,
      nombre: prod.nombre,
      categoria: prod.categoria,
      tipo_seccion: tipo,
      duracion_estimada_dias: estimado,
      imagen_url: prod.imagenes?.[0] || null
    });

    return acc;
  }, []);

  return unicos;
};

export const ingresosService = {
  async fetchIngresos() {
    await delay(200);
    await axios.get('/api/mock/ingresos').catch(() => {});
    return ingresosMock;
  },

  async fetchProductos() {
    await delay(150);
    return normalizarProductos();
  }
};
