import axios from 'axios';
import { keycloakService } from '../../../auth/keycloakService';

const posClient = axios.create({
  baseURL: '/api/pos',
});

posClient.interceptors.request.use((config) => {
  const token = keycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PaymentPayload {
  payment_method: 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'TRANSFER' | 'OTHER';
  amount: number;
  details?: Record<string, unknown>;
}

export interface SaleItemPayload {
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
}

export interface CreateSalePayload {
  cash_session_id: number;
  mode: 'INTERNAL' | 'ARCA_STUB';
  items: SaleItemPayload[];
  payments: PaymentPayload[];
  global_discount_percent?: number;
}

export const posApi = {
  getConfig: async () => {
    const { data } = await posClient.get('/config');
    return data;
  },
  getCurrentCashSession: async () => {
    const { data } = await posClient.get('/cash-sessions/current');
    return data;
  },
  openCashSession: async (payload: { cash_register_id: number; opening_amount: number; notes?: string }) => {
    const { data } = await posClient.post('/cash-sessions/open', payload);
    return data;
  },
  closeCashSession: async (payload: { cash_session_id: number; closing_amount: number; notes?: string }) => {
    const { data } = await posClient.post('/cash-sessions/close', payload);
    return data;
  },
  createSale: async (payload: CreateSalePayload) => {
    const { data } = await posClient.post('/sales', payload);
    return data;
  },
  getSale: async (id: number) => {
    const { data } = await posClient.get(`/sales/${id}`);
    return data;
  },
  searchProducts: async (query: string) => {
    const { data } = await axios.get('/api/productos', {
      params: { search: query },
      headers: {
        Authorization: keycloakService.getToken() ? `Bearer ${keycloakService.getToken()}` : undefined,
      },
    });
    return data?.data || [];
  },
};
