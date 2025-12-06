import { create } from 'zustand';
import { ofertasService } from '../services/ofertasService';

const generateId = () =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useOfertasStore = create((set, get) => ({
  ofertas: [],
  ofertasSugeridas: [],
  filtrosHistorial: {
    fecha: 'todo',
    tipo: '',
    estado: ''
  },
  async cargarOfertas() {
    const data = await ofertasService.fetchOfertas();
    set({ ofertas: data });
  },
  async cargarOfertasSugeridas() {
    const data = await ofertasService.fetchOfertasSugeridas();
    set({ ofertasSugeridas: data });
  },
  agregarOferta(oferta) {
    const nueva = {
      ...oferta,
      id: oferta.id || generateId(),
      estado: oferta.estado || 'VIGENTE',
      veces_aplicada: oferta.veces_aplicada || 1
    };
    set((state) => ({ ofertas: [nueva, ...state.ofertas] }));
    return nueva;
  },
  actualizarOferta(id, data) {
    let actualizado = null;
    set((state) => {
      const ofertas = state.ofertas.map((oferta) => {
        if (oferta.id === id) {
          actualizado = { ...oferta, ...data };
          return actualizado;
        }
        return oferta;
      });
      return { ofertas };
    });
    return actualizado;
  },
  finalizarOferta(id) {
    return get().actualizarOferta(id, { estado: 'FINALIZADA' });
  },
  setFiltrosHistorial(filtros) {
    set((state) => ({
      filtrosHistorial: {
        ...state.filtrosHistorial,
        ...filtros
      }
    }));
  }
}));
