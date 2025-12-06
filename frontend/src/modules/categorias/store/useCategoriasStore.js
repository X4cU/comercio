import { create } from 'zustand';
import { categoriasService } from '../services/categoriasService';

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useCategoriasStore = create((set, get) => ({
  categorias: [],
  loading: false,
  error: null,
  async cargarCategorias(force = false) {
    const { categorias, loading } = get();
    if (!force && categorias.length > 0) return categorias;
    if (loading) return categorias;
    set({ loading: true, error: null });
    try {
      const data = await categoriasService.fetchCategorias();
      set({ categorias: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message || 'Error al cargar categorías', loading: false });
      return [];
    }
  },
  agregarCategoria(categoria) {
    const nueva = {
      ...categoria,
      id: categoria.id || generateId(),
      fecha_creacion: categoria.fecha_creacion || new Date().toISOString()
    };
    set((state) => ({ categorias: [...state.categorias, nueva] }));
    return nueva;
  },
  actualizarCategoria(id, data) {
    let actualizada = null;
    set((state) => {
      const categorias = state.categorias.map((c) => {
        if (c.id === id) {
          actualizada = { ...c, ...data };
          return actualizada;
        }
        return c;
      });
      return { categorias };
    });
    return actualizada;
  },
  eliminarCategoria(id) {
    set((state) => ({ categorias: state.categorias.filter((c) => c.id !== id) }));
  },
  obtenerCategoria(id) {
    return get().categorias.find((c) => c.id === id);
  }
}));
