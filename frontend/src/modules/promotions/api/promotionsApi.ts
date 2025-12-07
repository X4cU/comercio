import axios from 'axios';
import { keycloakService } from '@/auth/keycloakService';

export type PromotionType = 'PERCENTAGE' | 'FIXED_PRICE';

export type PromotionEstado = 'activa' | 'programada' | 'vencida' | 'inactiva';

export interface Promotion {
  id: number;
  nombre: string;
  descripcion?: string | null;
  tipo: PromotionType;
  valor_descuento?: number | null;
  precio_promocional?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  activo: boolean;
  estado?: PromotionEstado;
  created_at?: string;
  updated_at?: string;
}

export type PromotionPayload = {
  nombre: string;
  descripcion?: string | null;
  tipo: PromotionType;
  valor_descuento?: number | null;
  precio_promocional?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  activo: boolean;
};

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

const normalizeResponse = (responseData: any): Promotion[] => {
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData)) return responseData;
  return [];
};

export const promotionsApi = {
  async getPromotions(params: Record<string, any> = {}): Promise<Promotion[]> {
    const response = await client.get('/', { params });
    return normalizeResponse(response.data);
  },
  async createPromotion(payload: PromotionPayload): Promise<Promotion> {
    const response = await client.post('/', payload);
    return response.data;
  },
  async updatePromotion(id: number, payload: PromotionPayload): Promise<Promotion> {
    const response = await client.put(`/${id}`, payload);
    return response.data;
  },
  async togglePromotion(id: number): Promise<Promotion> {
    const response = await client.post(`/${id}/toggle`);
    return response.data;
  },
  async deletePromotion(id: number): Promise<void> {
    await client.delete(`/${id}`);
  }
};
