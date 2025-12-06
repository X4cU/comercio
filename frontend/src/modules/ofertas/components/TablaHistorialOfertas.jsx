import React from 'react';

const toneMap = {
  OFERTA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100',
  LIQUIDACION: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100'
};

export function TablaHistorialOfertas({ ofertas = [] }) {
  return (
    <div className="table-base">
      <table className="w-full">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Tipo</th>
            <th>% desc</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Vigencia</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.map((oferta) => (
            <tr key={`${oferta.id}-${oferta.fecha_inicio}`}>
              <td>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{oferta.nombre_producto}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{oferta.categoria}</p>
                </div>
              </td>
              <td>
                <span
                  className={`status-pill ${toneMap[oferta.tipo] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}
                >
                  {oferta.tipo}
                </span>
              </td>
              <td className="font-semibold text-emerald-600 dark:text-emerald-300">{oferta.porcentaje_descuento}%</td>
              <td className="text-sm text-gray-800 dark:text-gray-200">
                ${oferta.precio_original.toFixed(2)} / ${oferta.precio_oferta.toFixed(2)}
              </td>
              <td className="text-sm text-gray-800 dark:text-gray-200">{oferta.stock_afectado}</td>
              <td className="text-sm text-gray-700 dark:text-gray-300">
                {oferta.fecha_inicio} - {oferta.fecha_fin}
              </td>
              <td>
                <span
                  className={`status-pill ${
                    oferta.estado === 'VIGENTE' ? 'active' : 'inactive'
                  }`}
                >
                  {oferta.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaHistorialOfertas;
