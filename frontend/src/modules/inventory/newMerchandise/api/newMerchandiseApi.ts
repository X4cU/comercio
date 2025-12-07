export type PricingDefaults = {
  margin: number;
  shrinkage: number;
};

export type BatchPayload = {
  product_id: number;
  arrival_date: string;
  expiration_date?: string | null;
  gross_cost_per_bulk: number;
  bulk_units: number;
  initial_shrinkage_rate?: number | null;
  margin_rate?: number | null;
  notes?: string;
};

const baseUrl = '/api/inventory';

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

export const newMerchandiseApi = {
  getConfig(productId?: number) {
    const query = productId ? `?product_id=${productId}` : '';
    return apiFetch(`/new-merchandise/config${query}`);
  },
  createBatch(payload: BatchPayload) {
    return apiFetch('/new-merchandise', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  listBatches(params: { section?: string } = {}) {
    const query = new URLSearchParams();
    if (params.section) {
      query.append('section', params.section);
    }
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch(`/batches${qs}`);
  },
};
