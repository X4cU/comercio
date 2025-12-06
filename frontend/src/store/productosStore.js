import { create } from 'zustand';
import { productosService } from '../modules/productos/services/productosService';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useProductosStore = create((set, get) => ({
  productos: [],
  loading: false,
  error: null,
  async getProductos() {
    set({ loading: true, error: null });
    try {
      const data = await productosService.fetchProductos();
      set({ productos: data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Error al cargar productos', loading: false });
    }
  },
  agregarProducto(producto) {
    const nuevo = {
      ...producto,
      id: producto.id || generateId(),
      fecha_creacion: producto.fecha_creacion || new Date().toISOString()
    };
    set((state) => ({ productos: [...state.productos, nuevo] }));
    return nuevo;
  },
  actualizarProducto(id, data) {
    let actualizado = null;
    set((state) => {
      const productos = state.productos.map((p) => {
        if (p.id === id) {
          actualizado = { ...p, ...data };
          return actualizado;
        }
        return p;
      });
      return { productos };
    });
    return actualizado;
  },
  eliminarProducto(id) {
    set((state) => ({ productos: state.productos.filter((p) => p.id !== id) }));
  },
  obtenerProducto(id) {
    const { productos } = get();
    return productos.find((p) => p.id === id);
  }
}));
