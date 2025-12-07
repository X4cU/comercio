import { useCallback, useEffect, useMemo, useState } from 'react';
import { posApi, CreateSalePayload, SaleItemPayload } from '../api/posApi';

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
  payment_method: CreateSalePayload['payment_method'];
  apply_discount: boolean;
  loading: boolean;
  error: string | null;
  lastSale: any;
}

export function usePos() {
  const [state, setState] = useState<PosState>({
    config: null,
    cashSession: null,
    items: [],
    payment_method: 'efectivo',
    apply_discount: true,
    loading: true,
    error: null,
    lastSale: null,
  });

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((acc, item) => acc + (item.unit_price || 0) * item.quantity, 0);
    const allowedDiscounts = state.config?.payment_discounts || {};
    const methodDiscount = state.apply_discount ? Number(allowedDiscounts[state.payment_method] || 0) : 0;
    const discountTotal = (subtotal * methodDiscount) / 100;
    const total = subtotal - discountTotal;
    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [state.items, state.apply_discount, state.payment_method, state.config]);

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

  const updatePaymentMethod = (payment_method: CreateSalePayload['payment_method']) =>
    setState((prev) => ({ ...prev, payment_method }));

  const toggleDiscount = (apply_discount: boolean) => setState((prev) => ({ ...prev, apply_discount }));

  const resetSale = () =>
    setState((prev) => ({
      ...prev,
      items: [],
      payment_method: 'efectivo',
      apply_discount: true,
      lastSale: null,
    }));

  const openCashSession = async (payload: { cash_register_id?: number; opening_amount: number; notes?: string }) => {
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
      items: state.items,
      payment_method: state.payment_method,
      apply_discount: state.apply_discount,
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
    updatePaymentMethod,
    toggleDiscount,
    resetSale,
    openCashSession,
    closeCashSession,
    confirmSale,
  };
}
