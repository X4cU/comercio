import React, { useState } from 'react';
import { IngresoForm } from '../components/IngresoForm';
import { ResumenCalculosPrecio } from '../components/ResumenCalculosPrecio';
import { useIngresosStore } from '../store/useIngresosStore';

const defaultResumen = {
  costo_bulto: 0,
  merma_porcentaje: 0,
  unidades_por_bulto: 0,
  precio_base_calculado: 0,
  margen_porcentaje: 0,
  precio_final_calculado: 0,
  stock_ingresado: 0,
  fecha_vencimiento: ''
};

export default function NuevoIngreso() {
  const { agregarIngreso } = useIngresosStore();
  const [resumen, setResumen] = useState(defaultResumen);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (payload) => {
    const created = agregarIngreso(payload);
    setMensaje(`Ingreso guardado para ${created.nombre_producto}`);
    setTimeout(() => setMensaje(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Stock</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Nuevo ingreso de mercadería</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Capturá costos, mermas y vencimientos para recalcular el precio de venta sugerido en tiempo real.
        </p>
      </div>

      {mensaje && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100">
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <IngresoForm onSubmit={handleSubmit} onChangeResumen={setResumen} />
        </div>
        <div className="xl:col-span-1">
          <ResumenCalculosPrecio {...resumen} />
        </div>
      </div>
    </div>
  );
}
