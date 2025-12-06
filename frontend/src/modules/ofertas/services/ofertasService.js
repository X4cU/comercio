import axios from 'axios';
import { ofertasMock, ofertasSugeridasMock } from '../mocks/ofertasMock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ofertasService = {
  async fetchOfertas() {
    await delay(200);
    await axios.get('/api/mock/ofertas').catch(() => {});
    return ofertasMock;
  },
  async fetchOfertasSugeridas() {
    await delay(180);
    await axios.get('/api/mock/ofertas-sugeridas').catch(() => {});
    return ofertasSugeridasMock;
  }
};
