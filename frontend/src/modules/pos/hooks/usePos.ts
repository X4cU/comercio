import { useCallback, useEffect, useMemo, useState } from 'react';
import { posApi, CreateSalePayload, SaleItemPayload, PaymentPayload } from '../api/posApi';

export interface PosConfig {
  payment_methods: string[];
  discount_limits: Record<string, number>;
  ticket: {
    prefix: string;
    legal_legend: string;
    store_name: string;
  };
  arca: {
    status: string;
    description: string;
  };
}

export interface PosState {
  config: PosConfig | null;
  cashSession: any;
  items: SaleItemPayload[];
  payments: PaymentPayload[];
  mode: 'INTERNAL' | 'ARCA_STUB';
  globalDiscountPercent: number;
  loading: boolean;
  error: string | null;
  lastSale: any;
}

export function usePos() {
  const [state, setState] = useState<PosState>({
    config: null,
    cashSession: null,
    items: [],
    payments: [],
    mode: 'INTERNAL',
    globalDiscountPercent: 0,
    loading: true,
    error: null,
    lastSale: null,
  });

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const discountByItem = state.items.reduce((acc, item) => acc + (item.discount_amount || 0), 0);
    const globalDiscount = ((subtotal - discountByItem) * state.globalDiscountPercent) / 100;
    const discountTotal = discountByItem + globalDiscount;
    const total = subtotal - discountTotal;
    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [state.items, state.globalDiscountPercent]);

  const loadConfig = useCallback(async () => {
    try {
      const [config, cashSession] = await Promise.all([posApi.getConfig(), posApi.getCurrentCashSession()]);
      setState((prev) => ({ ...prev, config, cashSession, loading: false }));
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error?.message || 'Error cargando configuración', loading: false }));
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const addItem = (item: SaleItemPayload) => {
    setState((prev) => ({ ...prev, items: [...prev.items, item] }));
  };

  const removeItem = (index: number) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const updatePayment = (payments: PaymentPayload[]) => {
    setState((prev) => ({ ...prev, payments }));
  };

  const updateMode = (mode: 'INTERNAL' | 'ARCA_STUB') => setState((prev) => ({ ...prev, mode }));

  const updateDiscount = (percent: number) => setState((prev) => ({ ...prev, globalDiscountPercent: percent }));

  const resetSale = () =>
    setState((prev) => ({
      ...prev,
      items: [],
      payments: [],
      mode: 'INTERNAL',
      globalDiscountPercent: 0,
      lastSale: null,
    }));

  const openCashSession = async (payload: { cash_register_id: number; opening_amount: number; notes?: string }) => {
    const session = await posApi.openCashSession(payload);
    setState((prev) => ({ ...prev, cashSession: session }));
    return session;
  };

  const closeCashSession = async (payload: { cash_session_id: number; closing_amount: number; notes?: string }) => {
    const session = await posApi.closeCashSession(payload);
    setState((prev) => ({ ...prev, cashSession: null }));
    return session;
  };

  const confirmSale = async () => {
    if (!state.cashSession) throw new Error('Debes abrir una caja antes de vender.');
    const payload: CreateSalePayload = {
      cash_session_id: state.cashSession.id,
      mode: state.mode,
      items: state.items,
      payments: state.payments,
      global_discount_percent: state.globalDiscountPercent,
    };
    const sale = await posApi.createSale(payload);
    setState((prev) => ({ ...prev, lastSale: sale }));
    return sale;
  };

  return {
    state,
    totals,
    addItem,
    removeItem,
    updatePayment,
    updateMode,
    updateDiscount,
    resetSale,
    openCashSession,
    closeCashSession,
    confirmSale,
  };
}
