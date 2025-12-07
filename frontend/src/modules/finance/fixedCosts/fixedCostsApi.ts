export type FixedCost = {
  id: number;
  name: string;
  monthly_amount: number;
  is_active: boolean;
  notes?: string | null;
  created_by: string;
  updated_by?: string | null;
};

export type FixedCostResponse = {
  data: FixedCost[];
  current_page: number;
  last_page: number;
};

const baseUrl = '/api/finance/fixed-costs';

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

export const fixedCostsApi = {
  list(params: { search?: string; is_active?: boolean } = {}): Promise<FixedCostResponse> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.is_active !== undefined) query.set('is_active', String(params.is_active));
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch(`${queryString}`);
  },
  create(payload: { name: string; monthly_amount: number; is_active?: boolean; notes?: string }) {
    return apiFetch('', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(id: number, payload: Partial<{ name: string; monthly_amount: number; is_active: boolean; notes?: string }>) {
    return apiFetch(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  dailyTotal(): Promise<{ daily_cost: number; total_monthly_costs: number; days_in_month: number }> {
    return apiFetch('/daily-total');
  },
};
