import axios from 'axios';
import { productosMock } from '../mocks/productosMock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const productosService = {
  async fetchProductos() {
    await delay(250);
    // axios placeholder to keep interface ready
    await axios.get('/api/mock/productos').catch(() => {});
    return productosMock;
  },
  async uploadImagenes(files) {
    await delay(150);
    return files.map((file) =>
      typeof file === 'string'
        ? file
        : URL.createObjectURL(file)
    );
  }
};
