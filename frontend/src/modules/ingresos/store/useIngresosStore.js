import { create } from 'zustand';
import { ingresosService } from '../services/ingresosService';

export const useIngresosStore = create((set, get) => ({
  ingresos: [],
  filtros: {
    productoId: '',
    tipo_seccion: '',
    fecha_desde: '',
    fecha_hasta: ''
  },
  loading: false,
  async cargarIngresos() {
    set({ loading: true });
    try {
      const data = await ingresosService.fetchIngresos();
      set({ ingresos: data, loading: false });
    } catch (error) {
      console.error('Error al cargar ingresos', error);
      set({ loading: false });
    }
  },
  agregarIngreso(nuevoIngreso) {
    const ingreso = {
      id: nuevoIngreso.id || `ing-${Date.now()}`,
      creado_en: nuevoIngreso.creado_en || new Date().toISOString(),
      ...nuevoIngreso
    };
    set((state) => ({ ingresos: [ingreso, ...state.ingresos] }));
    return ingreso;
  },
  setFiltros(nuevosFiltros) {
    set((state) => ({
      filtros: {
        ...state.filtros,
        ...nuevosFiltros
      }
    }));
  },
  getIngresosFiltrados() {
    const { ingresos, filtros } = get();
    const { productoId, tipo_seccion, fecha_desde, fecha_hasta } = filtros;

    return ingresos.filter((ingreso) => {
      const matchProducto = productoId ? ingreso.productoId === productoId : true;
      const matchTipo = tipo_seccion ? ingreso.tipo_seccion === tipo_seccion : true;
      const fechaLlegada = new Date(ingreso.fecha_llegada);
      const matchDesde = fecha_desde ? fechaLlegada >= new Date(fecha_desde) : true;
      const matchHasta = fecha_hasta ? fechaLlegada <= new Date(fecha_hasta) : true;
      return matchProducto && matchTipo && matchDesde && matchHasta;
    });
  }
}));
