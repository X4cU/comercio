import axios from 'axios';
import { categoriasMock } from '../mocks/categoriasMock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const categoriasService = {
  async fetchCategorias() {
    await delay(250);
    await axios.get('/api/mock/categorias').catch(() => {});
    return categoriasMock;
  }
};
