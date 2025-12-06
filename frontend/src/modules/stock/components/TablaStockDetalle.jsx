import React from 'react';

const badgeStyles = {
  OK: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  REPOSICION: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  OFERTA: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200',
  LIQUIDACION: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'
};

export function TablaStockDetalle({
  items,
  page,
  totalPages,
  onPageChange
}) {
  return (
    <div className="table-base">
      <table className="w-full">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Stock actual</th>
            <th scope="col">Stock óptimo</th>
            <th scope="col">Diferencia</th>
            <th scope="col">Días restantes</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No hay productos que coincidan con los filtros actuales.
              </td>
            </tr>
          )}
          {items.map((item) => {
            const diferencia = item.stock_actual - item.stock_optimo;
            const badgeClass = badgeStyles[item.estado_stock] || badgeStyles.OK;
            return (
              <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-50">{item.nombre_producto}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.es_perecedero ? 'Perecedero' : 'No perecedero'} · {item.unidad_medida}
                    </span>
                  </div>
                </td>
                <td className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.categoria}</td>
                <td className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.stock_actual}</td>
                <td className="text-sm text-gray-700 dark:text-gray-200">{item.stock_optimo}</td>
                <td className={`text-sm font-semibold ${diferencia >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                  {diferencia > 0 ? '+' : ''}
                  {diferencia}
                </td>
                <td className={`text-sm font-semibold ${item.dias_restantes <= 2 ? 'text-rose-600 dark:text-rose-300' : 'text-gray-800 dark:text-gray-200'}`}>
                  {item.dias_restantes} días
                </td>
                <td>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {item.estado_stock === 'REPOSICION' ? 'Reponer' : item.estado_stock}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
        <span>
          Página {page} de {totalPages || 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-1 text-xs"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1 text-xs"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
