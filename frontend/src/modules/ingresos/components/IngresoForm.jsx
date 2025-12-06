import React, { useEffect, useMemo, useState } from 'react';
import { SelectorProducto } from './SelectorProducto';

const initialState = {
  productoId: '',
  nombre_producto: '',
  categoria: '',
  tipo_seccion: '',
  fecha_llegada: '',
  fecha_vencimiento: '',
  duracion_estimada_dias: '',
  costo_bulto: '',
  unidades_por_bulto: '',
  merma_porcentaje: 0,
  margen_porcentaje: 30,
  stock_ingresado: '',
  imagen_url: '',
  observaciones: ''
};

export function IngresoForm({ onSubmit, onChangeResumen }) {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const mermaDecimal = useMemo(() => Number(data.merma_porcentaje || 0) / 100, [data.merma_porcentaje]);
  const margenDecimal = useMemo(() => Number(data.margen_porcentaje || 0) / 100, [data.margen_porcentaje]);

  const calcularFechaVencimiento = () => {
    if (data.tipo_seccion === 'VERDULERIA' && data.fecha_llegada && data.duracion_estimada_dias) {
      const base = new Date(data.fecha_llegada);
      const dias = Number(data.duracion_estimada_dias) || 0;
      base.setDate(base.getDate() + dias);
      return base.toISOString().slice(0, 10);
    }
    return data.fecha_vencimiento;
  };

  const calcularPrecios = () => {
    const costo = Number(data.costo_bulto) || 0;
    const unidades = Number(data.unidades_por_bulto) || 0;
    if (costo <= 0 || unidades <= 0 || mermaDecimal >= 1) {
      return { precio_base: 0, precio_final: 0 };
    }
    const precio_base = costo / (unidades * (1 - mermaDecimal));
    const precio_final = precio_base * (1 + margenDecimal);
    return {
      precio_base: Number(precio_base.toFixed(2)),
      precio_final: Number(precio_final.toFixed(2))
    };
  };

  useEffect(() => {
    if (data.tipo_seccion === 'VERDULERIA') {
      const nuevaFecha = calcularFechaVencimiento();
      setData((prev) => (prev.fecha_vencimiento === nuevaFecha ? prev : { ...prev, fecha_vencimiento: nuevaFecha }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.fecha_llegada, data.duracion_estimada_dias, data.tipo_seccion]);

  useEffect(() => {
    const { precio_base, precio_final } = calcularPrecios();
    const resumen = {
      ...data,
      precio_base_calculado: precio_base,
      precio_final_calculado: precio_final,
      fecha_vencimiento: calcularFechaVencimiento()
    };
    onChangeResumen?.(resumen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mermaDecimal, margenDecimal]);

  const handleProductoSelect = (producto) => {
    if (!producto) {
      setData(initialState);
      return;
    }
    setData((prev) => ({
      ...prev,
      productoId: producto.id,
      nombre_producto: producto.nombre,
      categoria: producto.categoria,
      tipo_seccion: producto.tipo_seccion,
      duracion_estimada_dias: producto.tipo_seccion === 'VERDULERIA' ? producto.duracion_estimada_dias : prev.duracion_estimada_dias,
      fecha_vencimiento: producto.tipo_seccion === 'VERDULERIA' ? calcularFechaVencimiento() : prev.fecha_vencimiento
    }));
    setErrors((prev) => ({ ...prev, productoId: '', tipo_seccion: '', duracion_estimada_dias: '' }));
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!data.productoId) nextErrors.productoId = 'Seleccioná un producto';
    if (!data.tipo_seccion) nextErrors.tipo_seccion = 'Indicá el tipo de sección';
    if (!data.fecha_llegada) nextErrors.fecha_llegada = 'Ingresá la fecha de llegada';
    if (data.tipo_seccion === 'VERDULERIA' && !data.duracion_estimada_dias) {
      nextErrors.duracion_estimada_dias = 'Duración estimada requerida';
    }
    if ((data.tipo_seccion === 'DESPENSA' || data.tipo_seccion === 'FIAMBRERIA') && !data.fecha_vencimiento) {
      nextErrors.fecha_vencimiento = 'Ingresá la fecha de vencimiento';
    }
    if (!data.costo_bulto || Number(data.costo_bulto) <= 0) nextErrors.costo_bulto = 'Costo requerido';
    if (!data.unidades_por_bulto || Number(data.unidades_por_bulto) <= 0) nextErrors.unidades_por_bulto = 'Unidades por bulto requeridas';
    if (data.merma_porcentaje < 0 || data.merma_porcentaje > 80) nextErrors.merma_porcentaje = 'Merma entre 0% y 80%';
    if (data.margen_porcentaje < 0 || data.margen_porcentaje > 200) nextErrors.margen_porcentaje = 'Margen entre 0% y 200%';
    if (!data.stock_ingresado || Number(data.stock_ingresado) <= 0) nextErrors.stock_ingresado = 'Stock debe ser mayor a 0';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const { precio_base, precio_final } = calcularPrecios();
    const fecha_vencimiento = calcularFechaVencimiento();
    const payload = {
      ...data,
      costo_bulto: Number(data.costo_bulto),
      unidades_por_bulto: Number(data.unidades_por_bulto),
      merma_porcentaje: Number(data.merma_porcentaje),
      margen_porcentaje: Number(data.margen_porcentaje),
      duracion_estimada_dias: data.tipo_seccion === 'VERDULERIA' ? Number(data.duracion_estimada_dias) : null,
      stock_ingresado: Number(data.stock_ingresado),
      precio_base_calculado: precio_base,
      precio_final_calculado: precio_final,
      fecha_vencimiento,
      fecha_llegada: data.fecha_llegada,
      observaciones: data.observaciones
    };
    onSubmit?.(payload);
    setSubmitting(false);
    setData(initialState);
  };

  return (
    <form className="card space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Ingreso de mercadería</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Registrar nuevo ingreso</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setData(initialState)}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar ingreso'}
          </button>
        </div>
      </div>

      <SelectorProducto
        value={data.productoId ? { id: data.productoId, nombre: data.nombre_producto, categoria: data.categoria, tipo_seccion: data.tipo_seccion, duracion_estimada_dias: data.duracion_estimada_dias } : null}
        onSelect={(producto) => handleProductoSelect(producto)}
      />
      {errors.productoId && <span className="input-error">{errors.productoId}</span>}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span>Tipo de sección</span>
          <select
            value={data.tipo_seccion}
            onChange={(e) => handleChange('tipo_seccion', e.target.value)}
            className="capitalize"
          >
            <option value="">Seleccionar</option>
            <option value="VERDULERIA">Verdulería</option>
            <option value="DESPENSA">Despensa</option>
            <option value="FIAMBRERIA">Fiambrería</option>
          </select>
          {errors.tipo_seccion && <span className="input-error">{errors.tipo_seccion}</span>}
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span>Fecha llegada</span>
            <input
              type="date"
              value={data.fecha_llegada}
              onChange={(e) => handleChange('fecha_llegada', e.target.value)}
              required
            />
            {errors.fecha_llegada && <span className="input-error">{errors.fecha_llegada}</span>}
          </label>
          <label className="flex flex-col gap-1">
            <span>Fecha vencimiento</span>
            <input
              type="date"
              value={calcularFechaVencimiento() || ''}
              onChange={(e) => handleChange('fecha_vencimiento', e.target.value)}
              disabled={data.tipo_seccion === 'VERDULERIA'}
            />
            {errors.fecha_vencimiento && <span className="input-error">{errors.fecha_vencimiento}</span>}
          </label>
        </div>
      </div>

      {data.tipo_seccion === 'VERDULERIA' && (
        <label className="flex flex-col gap-1">
          <span>Duración estimada (días)</span>
          <input
            type="number"
            min="1"
            value={data.duracion_estimada_dias}
            onChange={(e) => handleChange('duracion_estimada_dias', e.target.value)}
          />
          {errors.duracion_estimada_dias && <span className="input-error">{errors.duracion_estimada_dias}</span>}
        </label>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>Costo por bulto</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.costo_bulto}
            onChange={(e) => handleChange('costo_bulto', e.target.value)}
          />
          {errors.costo_bulto && <span className="input-error">{errors.costo_bulto}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Unidades/Kg por bulto</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.unidades_por_bulto}
            onChange={(e) => handleChange('unidades_por_bulto', e.target.value)}
          />
          {errors.unidades_por_bulto && <span className="input-error">{errors.unidades_por_bulto}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Merma % (0 - 80)</span>
          <input
            type="number"
            min="0"
            max="80"
            step="0.1"
            value={data.merma_porcentaje}
            onChange={(e) => handleChange('merma_porcentaje', Number(e.target.value))}
          />
          {errors.merma_porcentaje && <span className="input-error">{errors.merma_porcentaje}</span>}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>Margen % (0 - 200)</span>
          <input
            type="number"
            min="0"
            max="200"
            step="0.1"
            value={data.margen_porcentaje}
            onChange={(e) => handleChange('margen_porcentaje', Number(e.target.value))}
          />
          {errors.margen_porcentaje && <span className="input-error">{errors.margen_porcentaje}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Stock ingresado</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.stock_ingresado}
            onChange={(e) => handleChange('stock_ingresado', e.target.value)}
          />
          {errors.stock_ingresado && <span className="input-error">{errors.stock_ingresado}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Imagen (URL)</span>
          <input
            type="url"
            value={data.imagen_url}
            onChange={(e) => handleChange('imagen_url', e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span>Observaciones</span>
        <textarea
          rows="3"
          value={data.observaciones}
          onChange={(e) => handleChange('observaciones', e.target.value)}
          placeholder="Notas internas del lote, proveedor, etc."
        />
      </label>
    </form>
  );
}
