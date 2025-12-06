export type PurchaseSuggestionItem = {
  id: number;
  product_id: number;
  current_stock: number;
  optimal_stock: number;
  min_stock: number;
  projected_sales_days: number;
  avg_daily_sales: number;
  safety_stock: number;
  recommended_qty: number;
  final_qty: number;
  reason_flags: string[];
  notes?: string | null;
  product?: any;
};

export type PurchaseSuggestion = {
  id: number;
  reference_date: string;
  status: string;
  created_by: string;
  confirmed_by?: string | null;
  notes?: string | null;
  items: PurchaseSuggestionItem[];
};

const baseUrl = '/api/purchasing';

async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Error al comunicarse con el servidor');
  }

  return response.json();
}

export const purchasingApi = {
  listSuggestions(params: { status?: string } = {}) {
    const query = new URLSearchParams();
    if (params.status) {
      query.append('status', params.status);
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch(`/suggestions${queryString}`);
  },
  getSuggestion(id: number) {
    return apiFetch(`/suggestions/${id}`);
  },
  generateSuggestion(payload: { reference_date?: string; projected_sales_days?: number }) {
    return apiFetch('/suggestions/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateItem(suggestionId: number, itemId: number, payload: { final_qty: number; notes?: string }) {
    return apiFetch(`/suggestions/${suggestionId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  confirmSuggestion(id: number) {
    return apiFetch(`/suggestions/${id}/confirm`, { method: 'POST' });
  },
  cancelSuggestion(id: number) {
    return apiFetch(`/suggestions/${id}/cancel`, { method: 'POST' });
  },
};
