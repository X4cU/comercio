import axios from 'axios';
import { stockMock } from '../mocks/stockMock';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const calcularEstadoStock = (item) => {
  if (item.dias_restantes <= 1) return 'LIQUIDACION';
  if (item.dias_restantes === 2) return 'OFERTA';
  if (item.stock_actual < item.stock_optimo) return 'REPOSICION';
  return 'OK';
};

export const stockService = {
  async fetchStock() {
    await delay(250);
    await axios.get('/api/mock/stock').catch(() => {});
    return stockMock.map((item) => ({
      ...item,
      estado_stock: calcularEstadoStock(item)
    }));
  }
};
