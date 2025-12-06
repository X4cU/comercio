import axios from 'axios';
import { keycloakService } from '../../../auth/keycloakService';

const client = axios.create({
  baseURL: '/api/offers'
});

client.interceptors.request.use((config) => {
  const token = keycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const offersApi = {
  async getSuggestions(params = {}) {
    const response = await client.get('/suggestions', { params });
    return response.data;
  },
  async getActiveOffers(params = {}) {
    const response = await client.get('/active', { params });
    return response.data;
  },
  async createOffer(payload) {
    const response = await client.post('/', payload);
    return response.data;
  },
  async updateOffer(id, payload) {
    const response = await client.patch(`/${id}`, payload);
    return response.data;
  },
  async cancelOffer(id) {
    const response = await client.post(`/${id}/cancel`);
    return response.data;
  },
  async getOfferDetail(id) {
    const response = await client.get(`/${id}`);
    return response.data;
  },
  async getTopStats(params = {}) {
    const response = await client.get('/stats/top', { params });
    return response.data;
  },
  async getPriceForProduct(productId) {
    const response = await client.get(`/price-for-product/${productId}`);
    return response.data;
  }
};
