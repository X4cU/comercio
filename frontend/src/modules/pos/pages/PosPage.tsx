import React, { useEffect, useMemo, useRef, useState } from 'react';
import { posApi, SaleItemPayload } from '../api/posApi';
import DashboardLayout from '@/layout/DashboardLayout';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface CartItem extends SaleItemPayload {
  name: string;
  stock: number;
  insufficient: boolean;
}

function resolvePrice(product: any): number {
  return (
    Number(product?.precio_actual) ||
    Number(product?.current_sale_price) ||
    Number(product?.precio) ||
    Number(product?.precioFinal) ||
    0
  );
}

function resolveStock(product: any): number {
  return Number(product?.stock_actual ?? product?.stock ?? 0);
}

export default function PosPage() {
  const [config, setConfig] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'debito' | 'credito' | 'mp'>('efectivo');
  const [applyDiscount, setApplyDiscount] = useState(true);
  const [openingAmount, setOpeningAmount] = useState('0');
  const [closingAmount, setClosingAmount] = useState('0');
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<any>(null);
  const barcodeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      const [cfg, currentSession] = await Promise.all([posApi.getConfig(), posApi.getCurrentCashSession()]);
      setConfig(cfg);
      setSession(currentSession);
      if (!currentSession) setShowOpenModal(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      setSearching(true);
      const results = await posApi.searchProducts(searchQuery);
      setSearchResults(results);
      setSearching(false);
    }, 250);

    return () => clearTimeout(handle);
  }, [searchQuery]);

  const paymentDiscount = useMemo(() => {
    const discounts = config?.payment_discounts || {};
    return Number(discounts[paymentMethod] || 0);
  }, [config, paymentMethod]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.unit_price || 0) * item.quantity, 0);
    const discountTotal = applyDiscount ? (subtotal * paymentDiscount) / 100 : 0;
    const total = subtotal - discountTotal;
    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [cart, paymentDiscount, applyDiscount]);

  const addProductToCart = (product: any, quantity = 1) => {
    const unitPrice = resolvePrice(product);
    const stock = resolveStock(product);

    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      const newQuantity = (existing?.quantity || 0) + quantity;
      const insufficient = stock < newQuantity;
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: newQuantity, unit_price: unitPrice, stock, insufficient }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          quantity,
          unit_price: unitPrice,
          name: product.nombre,
          stock,
          insufficient,
        },
      ];
    });
  };

  const handleBarcodeSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (!value) return;
      const results = await posApi.searchProducts(value);
      if (results.length) {
        addProductToCart(results[0], 1);
        setMessage(`Producto ${results[0].nombre} agregado por escaneo.`);
      } else {
        setMessage('No se encontró el producto escaneado.');
      }
      event.currentTarget.value = '';
    }
  };

  const updateQuantity = (productId: number, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product_id !== productId) return item;
        const normalized = qty > 0 ? qty : 1;
        return { ...item, quantity: normalized, insufficient: item.stock < normalized };
      })
    );
  };

  const removeItem = (productId: number) => setCart((prev) => prev.filter((item) => item.product_id !== productId));

  const confirmSale = async () => {
    if (!session) {
      setMessage('Debes abrir caja antes de confirmar una venta.');
      setShowOpenModal(true);
      return;
    }

    if (!cart.length) {
      setMessage('Agrega productos al carrito antes de continuar.');
      return;
    }

    const payload = {
      cash_session_id: session.id,
      items: cart.map((item) => ({ product_id: item.product_id, quantity: item.quantity, unit_price: item.unit_price })),
      payment_method: paymentMethod,
      apply_discount: applyDiscount && paymentDiscount > 0,
    } as const;

    try {
      const sale = await posApi.createSale(payload);
      setLastSale(sale);
      setCart([]);
      setMessage('Venta registrada correctamente.');
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'No se pudo registrar la venta.');
    }
  };

  const openSession = async () => {
    const amount = Number(openingAmount || '0');
    const created = await posApi.openCashSession({ opening_amount: amount });
    setSession(created);
    setShowOpenModal(false);
    setMessage('Caja abierta para este usuario.');
  };

  const closeSession = async () => {
    if (!session) return;
    const closed = await posApi.closeCashSession({ cash_session_id: session.id, closing_amount: Number(closingAmount || '0') });
    setSession(null);
    setShowCloseModal(false);
    setMessage('Caja cerrada.');
    setLastSale(null);
    console.info('Resumen de cierre', closed);
  };

  const paymentMethods = useMemo(
    () => config?.payment_methods || ['efectivo', 'transferencia', 'debito', 'credito', 'mp'],
    [config]
  );

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Punto de venta</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Caja supermercado</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
              {session ? 'Caja abierta' : 'Caja cerrada'}
            </div>
            {!session && (
              <button
                onClick={() => setShowOpenModal(true)}
                className="rounded-md bg-emerald-500 px-4 py-2 text-white shadow hover:bg-emerald-600"
              >
                Abrir caja
              </button>
            )}
            {session && (
              <button
                onClick={() => setShowCloseModal(true)}
                className="rounded-md bg-amber-500 px-4 py-2 text-white shadow hover:bg-amber-600"
              >
                Cerrar caja
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <input
                  ref={barcodeRef}
                  onKeyDown={handleBarcodeSubmit}
                  placeholder="Escanea código de barras (Enter para agregar)"
                  className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-inner focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar producto por nombre, SKU o código"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-inner focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="mt-3 max-h-72 overflow-y-auto">
                {searching && <p className="text-xs text-slate-500">Buscando...</p>}
                {!searching && searchResults.length === 0 && searchQuery.length > 1 && (
                  <p className="text-xs text-slate-500">Sin resultados</p>
                )}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProductToCart(product, 1)}
                      className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-3 text-left shadow-sm transition hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{product.nombre}</span>
                      <span className="text-xs text-slate-500">${resolvePrice(product).toFixed(2)}</span>
                      <span
                        className={`mt-1 w-fit rounded-full px-2 py-0.5 text-xs ${resolveStock(product) < 1 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'}`}
                      >
                        Stock: {resolveStock(product)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Carrito</h2>
                <span className="text-sm text-slate-500">{cart.length} ítems</span>
              </div>
              <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        ${item.unit_price?.toFixed(2)} | Stock actual: {item.stock}
                      </p>
                      {item.insufficient && (
                        <p className="text-xs text-amber-500">Stock insuficiente (se permitirá negativo).</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0.001}
                        step={0.001}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                        className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <span className="w-24 text-right text-sm font-semibold text-slate-900 dark:text-white">
                        ${((item.unit_price || 0) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-sm text-red-500 hover:text-red-600"
                        type="button"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
                {!cart.length && <p className="py-4 text-sm text-slate-500">Sin productos cargados.</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Totales</h3>
                <CurrencyDollarIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Descuento</span>
                  <span>
                    {applyDiscount && paymentDiscount > 0 ? `${paymentDiscount}% (-$${totals.discountTotal.toFixed(2)})` : 'No aplicado'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-emerald-600 dark:text-emerald-300">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="text-xs text-slate-500 dark:text-slate-400">Método de pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {paymentMethods.map((method: string) => (
                    <option key={method} value={method}>
                      {method.toUpperCase()}
                    </option>
                  ))}
                </select>

                {(paymentMethod === 'efectivo' || paymentMethod === 'transferencia') && (
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={applyDiscount}
                      onChange={(e) => setApplyDiscount(e.target.checked)}
                      disabled={paymentDiscount <= 0}
                    />
                    Aplicar descuento permitido ({paymentDiscount}% máximo)
                  </label>
                )}

                <button
                  onClick={confirmSale}
                  disabled={!cart.length || !session}
                  className="w-full rounded-md bg-emerald-500 px-4 py-3 text-lg font-semibold text-white shadow disabled:opacity-50"
                >
                  Confirmar venta
                </button>
              </div>
            </div>

            {lastSale && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="font-semibold text-emerald-500">Última venta</p>
                <p>Número: {lastSale.sale_number}</p>
                <p>Total: ${Number(lastSale.total).toFixed(2)}</p>
                <p>Método: {lastSale.payment_method}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showOpenModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Abrir caja</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Ingresa el monto inicial de la caja.</p>
            <input
              type="number"
              value={openingAmount}
              onChange={(e) => setOpeningAmount(e.target.value)}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowOpenModal(false)} className="rounded-md px-4 py-2 text-sm text-slate-700 dark:text-slate-200">
                Cancelar
              </button>
              <button onClick={openSession} className="rounded-md bg-emerald-500 px-4 py-2 text-white">
                Abrir
              </button>
            </div>
          </div>
        </div>
      )}

      {showCloseModal && session && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cerrar caja</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Monto final declarado</p>
            <input
              type="number"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCloseModal(false)} className="rounded-md px-4 py-2 text-sm text-slate-700 dark:text-slate-200">
                Cancelar
              </button>
              <button onClick={closeSession} className="rounded-md bg-amber-500 px-4 py-2 text-white">
                Cerrar caja
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
