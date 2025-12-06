import React, { useEffect, useMemo, useState } from 'react';
import { posApi } from '../api/posApi';

interface Props {
  onAdd: (item: { product_id: number; unit_price: number; quantity: number; product_name?: string }) => void;
}

export default function ProductSearch({ onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const found = await posApi.searchProducts(query);
        setResults(found);
      } catch (err) {
        console.error('Error al buscar productos', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const placeholder = useMemo(() => 'Buscar por nombre, SKU o código de barras', []);

  return (
    <div className="bg-slate-900 rounded-lg p-4 mb-4">
      <label className="text-sm text-slate-300 mb-2 block">Búsqueda de productos</label>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="number"
          min={0.001}
          step={0.001}
          className="w-24 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div className="mt-3">
        {loading && <p className="text-xs text-slate-400">Buscando...</p>}
        {!loading && results.length === 0 && query.length >= 2 && (
          <p className="text-xs text-slate-500">Sin resultados para la búsqueda.</p>
        )}
        <ul className="divide-y divide-slate-800 mt-2 max-h-40 overflow-y-auto">
          {results.map((product) => (
            <li
              key={product.id}
              className="py-2 flex items-center justify-between hover:bg-slate-800 px-2 rounded"
            >
              <div>
                <p className="text-sm font-semibold text-white">{product.nombre}</p>
                <p className="text-xs text-slate-400">SKU: {product.sku}</p>
              </div>
              <button
                className="bg-emerald-500 text-white text-sm px-3 py-1 rounded"
                onClick={() =>
                  onAdd({
                    product_id: product.id,
                    unit_price: Number(product.precio || 0) || 1,
                    quantity,
                    product_name: product.nombre,
                  })
                }
              >
                Agregar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
