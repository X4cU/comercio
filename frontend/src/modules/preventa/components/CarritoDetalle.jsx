import React from 'react';

export default function CarritoDetalle({ items = [], onActualizarCantidad, onEliminar, editable = true }) {
  const handleCantidad = (itemId, value) => {
    const cantidad = Number(value);
    if (Number.isNaN(cantidad)) return;
    onActualizarCantidad?.(itemId, cantidad);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cantidad</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Precio unit.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Desc. unidad</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Subtotal bruto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Subtotal neto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {items.map((item) => {
              const excedeStock = item.cantidad > item.stock_disponible;
              return (
                <tr
                  key={item.id}
                  className={`${
                    excedeStock ? 'bg-red-50/60 dark:bg-red-900/20' : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/70'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.nombre}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Stock: {item.stock_disponible}</div>
                  </td>
                  <td className="px-4 py-3">
                    {editable ? (
                      <input
                        type="number"
                        min={1}
                        value={item.cantidad}
                        onChange={(e) => handleCantidad(item.id, e.target.value)}
                        className={`w-24 rounded-lg border px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
                          excedeStock ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                        }`}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.cantidad}</span>
                    )}
                    {excedeStock && (
                      <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-300">Excede stock disponible</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">${item.precio_unitario.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                    {item.precio_oferta_aplicado
                      ? `$${(item.precio_unitario - item.precio_oferta_aplicado).toFixed(2)}`
                      : '—'}
                    {item.precio_oferta_aplicado && (
                      <span className="ml-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800">
                        ${item.precio_oferta_aplicado.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">${
                    item.subtotal_bruto.toFixed(2)
                  }</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">${
                    item.subtotal_neto.toFixed(2)
                  }</td>
                  <td className="px-4 py-3">
                    {editable ? (
                      <button
                        type="button"
                        onClick={() => onEliminar?.(item.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-100 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-800"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  El carrito está vacío.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
