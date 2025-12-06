import React, { useMemo, useState } from 'react';

export default function BuscadorProductoCarrito({ productos = [], onAgregar }) {
  const [termino, setTermino] = useState('');
  const [cantidades, setCantidades] = useState({});

  const resultados = useMemo(() => {
    const q = termino.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((producto) => {
      const nombre = producto.nombre?.toLowerCase() || '';
      const categoria = producto.categoria?.toLowerCase() || '';
      return nombre.includes(q) || categoria.includes(q);
    });
  }, [productos, termino]);

  const handleAgregar = (producto) => {
    const cantidad = Math.max(1, Number(cantidades[producto.id]) || 1);
    setCantidades((prev) => ({ ...prev, [producto.id]: cantidad }));
    onAgregar?.(producto, cantidad);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Buscar por nombre o categoría"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-gray-800 dark:text-emerald-200 dark:ring-gray-700">
            {resultados.length} resultados
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {resultados.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white/80 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80"
          >
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
              {producto.imagen ? (
                <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">Sin foto</div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{producto.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{producto.categoria || 'Sin categoría'}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                {producto.precioOferta && producto.precioOferta < producto.precioUnitario ? (
                  <>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-800">
                      Oferta {producto.porcentajeOferta}%
                    </span>
                    <span className="text-gray-500 line-through dark:text-gray-400">${producto.precioUnitario.toFixed(2)}</span>
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-200">
                      ${producto.precioOferta.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    ${Number(producto.precioUnitario || 0).toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">Stock: {producto.stock}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={cantidades[producto.id] ?? 1}
                onChange={(e) => setCantidades((prev) => ({ ...prev, [producto.id]: e.target.value }))}
                className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => handleAgregar(producto)}
                disabled={producto.stock <= 0}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
        {resultados.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
            Sin productos que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}
