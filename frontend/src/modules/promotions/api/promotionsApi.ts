import axios from 'axios';
import { keycloakService } from '../../../auth/keycloakService';

const client = axios.create({
  baseURL: '/api/promotions'
});

client.interceptors.request.use((config) => {
  const token = keycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const promotionsApi = {
  async list(params: any = {}) {
    const response = await client.get('/', { params });
    return response.data;
  },
  async find(id: number) {
    const response = await client.get(`/${id}`);
    return response.data;
  },
  async create(payload: any) {
    const response = await client.post('/', payload);
    return response.data;
  },
  async update(id: number, payload: any) {
    const response = await client.patch(`/${id}`, payload);
    return response.data;
  },
  async toggle(id: number) {
    const response = await client.post(`/${id}/toggle`);
    return response.data;
  },
  async remove(id: number) {
    const response = await client.delete(`/${id}`);
    return response.data;
  },
  async check(payload: any) {
    const response = await client.post('/check', payload);
    return response.data;
  }
};
