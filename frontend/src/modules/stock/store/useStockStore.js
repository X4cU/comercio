import { create } from 'zustand';
import { stockService } from '../services/stockService';

export const useStockStore = create((set, get) => ({
  stock: [],
  loading: false,
  filtros: {
    texto: '',
    categoria: '',
    estado: ''
  },
  async cargarStock() {
    set({ loading: true });
    try {
      const data = await stockService.fetchStock();
      set({ stock: data, loading: false });
    } catch (error) {
      console.error('Error al cargar stock', error);
      set({ loading: false });
    }
  },
  setFiltros(nuevosFiltros) {
    set((state) => ({
      filtros: {
        ...state.filtros,
        ...nuevosFiltros
      }
    }));
  },
  filtrarStock() {
    const { stock, filtros } = get();
    const texto = filtros.texto?.toLowerCase() || '';

    return stock.filter((item) => {
      const matchesTexto = item.nombre_producto.toLowerCase().includes(texto);
      const matchesCategoria = filtros.categoria ? item.categoria === filtros.categoria : true;
      const matchesEstado = filtros.estado ? item.estado_stock === filtros.estado : true;
      return matchesTexto && matchesCategoria && matchesEstado;
    });
  }
}));
