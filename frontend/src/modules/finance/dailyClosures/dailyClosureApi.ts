export type DailyClosure = {
  id: number;
  closure_date: string;
  total_sales: number;
  total_fixed_costs: number;
  gross_profit: number;
  notes?: string | null;
  created_by: string;
  status: 'CLOSED' | 'ANNULLED';
  annulled_by?: string | null;
  annulled_at?: string | null;
};

export type DailySummary = {
  date: string;
  total_sales: number;
  daily_cost: number;
  gross_profit: number;
  payment_totals: { payment_method: string; total: number }[];
  closure?: DailyClosure | null;
};

const baseUrl = '/api/finance/daily-closures';

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

export const dailyClosureApi = {
  getToday(): Promise<DailySummary> {
    return apiFetch('/today');
  },
  create(payload: { notes?: string }) {
    return apiFetch('', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  list(): Promise<{ data: DailyClosure[] }> {
    return apiFetch('');
  },
  detail(id: number): Promise<DailyClosure> {
    return apiFetch(`/${id}`);
  },
  annul(id: number) {
    return apiFetch(`/${id}/annul`, { method: 'POST' });
  },
};
