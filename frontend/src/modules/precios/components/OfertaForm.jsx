import React, { useEffect, useMemo, useState } from 'react';
import { TagIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getProductosLite } from '../../productos/services/productosService';
import { calcularPrecioFinal, getOfertasPorProducto } from '../services/ofertasService';
import { getPrecio } from '../services/preciosService';
import OfertaCard from './OfertaCard';

export function OfertaForm({ productoSeleccionado = null, onSubmit, onCancel }) {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState(productoSeleccionado?.id || '');
  const [tipo, setTipo] = useState('porcentaje');
  const [valor, setValor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [comentario, setComentario] = useState('');
  const [precioBase, setPrecioBase] = useState(0);
  const [errores, setErrores] = useState([]);
  const [ofertasSolapadas, setOfertasSolapadas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getProductosLite().then((lista) => {
      setProductos(lista);
      if (!productoId && lista.length > 0) {
        setProductoId(lista[0].id);
      }
    });
  }, [productoId]);

  useEffect(() => {
    if (!productoId) return;
    getPrecio(productoId).then((p) => setPrecioBase(p.precioVenta ?? 0));
    if (fechaInicio && fechaFin) {
      getOfertasPorProducto(productoId).then((ofertas) => {
        const overlaps = ofertas.filter((o) => {
          const inicio = new Date(o.fechaInicio).getTime();
          const fin = new Date(o.fechaFin).getTime();
          const inicioNuevo = new Date(fechaInicio).getTime();
          const finNuevo = new Date(fechaFin).getTime();
          return inicioNuevo <= fin && finNuevo >= inicio;
        });
        setOfertasSolapadas(overlaps);
      });
    }
  }, [productoId, fechaInicio, fechaFin]);

  useEffect(() => {
    if (productoSeleccionado) {
      setProductoId(productoSeleccionado.id);
    }
  }, [productoSeleccionado]);

  const productoActual = useMemo(() => productos.find((p) => p.id === productoId), [productoId, productos]);

  const preview = useMemo(() => {
    const oferta = {
      tipo,
      valor: Number(valor) || 0,
      fechaInicio: fechaInicio || new Date().toISOString(),
      fechaFin: fechaFin || new Date().toISOString(),
      estado: undefined
    };
    const { precioFinal, porcentajeAplicado } = calcularPrecioFinal({ precioVenta: precioBase }, oferta, precioBase);
    const estado = (() => {
      const ahora = new Date();
      const ini = fechaInicio ? new Date(fechaInicio) : ahora;
      const fin = fechaFin ? new Date(fechaFin) : ahora;
      if (fin < ahora) return 'expirada';
      if (ini > ahora) return 'programada';
      return 'activa';
    })();

    return {
      ...oferta,
      estado,
      precioBase,
      precioFinal,
      porcentajeAplicado
    };
  }, [tipo, valor, fechaInicio, fechaFin, precioBase]);

  const validar = () => {
    const mensajes = [];
    const valorNumerico = Number(valor);
    if (!productoId) mensajes.push('Selecciona un producto');
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) mensajes.push('El valor de descuento debe ser mayor a 0');
    if (tipo === 'porcentaje' && valorNumerico > 90) mensajes.push('El porcentaje no puede superar el 90%');
    if (tipo === 'monto' && valorNumerico >= precioBase) mensajes.push('El monto fijo debe ser menor al precio actual');

    if (!fechaInicio || !fechaFin) mensajes.push('Define fecha inicio y fin');
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio))
      mensajes.push('La fecha fin debe ser posterior o igual a la fecha inicio');

    if (preview.precioFinal < 0) mensajes.push('El precio final no puede ser negativo');

    setErrores(mensajes);
    return mensajes.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    try {
      setGuardando(true);
      await onSubmit?.({
        productoId,
        tipo,
        valor: Number(valor),
        fechaInicio,
        fechaFin,
        comentario,
        precioFinal: preview.precioFinal,
        porcentajeAplicado: preview.porcentajeAplicado,
        precioBase
      });
      setErrores([]);
    } catch (error) {
      setErrores([error.message]);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        <div className="space-y-2 md:col-span-2">
          <label>Producto</label>
          <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
            <option value="">Seleccionar</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          {productoActual && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{productoActual.categoria || 'Sin categoría'}</p>
          )}
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Precio actual</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">${precioBase?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label>Tipo de oferta</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('porcentaje')}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                tipo === 'porcentaje'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              <TagIcon className="mr-2 inline h-4 w-4" /> Porcentaje
            </button>
            <button
              type="button"
              onClick={() => setTipo('monto')}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                tipo === 'monto'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              <TagIcon className="mr-2 inline h-4 w-4" /> Monto fijo
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label>Valor del descuento {tipo === 'porcentaje' ? '(%)' : '($)'}</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ej: 20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label>Fecha inicio</label>
          <input type="datetime-local" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label>Fecha fin</label>
          <input type="datetime-local" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label>Comentario (opcional)</label>
        <textarea
          rows={2}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Notas internas de la oferta"
        />
      </div>

      {ofertasSolapadas.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
          <ExclamationTriangleIcon className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">Hay ofertas superpuestas</p>
            <p className="text-xs">Se permitirá crear la oferta pero se recomienda revisar vigencias.</p>
          </div>
        </div>
      )}

      {errores.length > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
          <ul className="list-disc space-y-1 pl-4">
            {errores.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-sm dark:border-emerald-800 dark:bg-emerald-900/30">
          <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Vista previa</p>
          <OfertaCard oferta={preview} producto={productoActual} mostrarAcciones={false} />
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Simulador de precio final</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">${preview.precioFinal.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Aplicando {preview.porcentajeAplicado}% de descuento</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={guardando}>
          {guardando && <ArrowPathIcon className="h-4 w-4 animate-spin" />} Crear oferta
        </button>
      </div>
    </form>
  );
}

export default OfertaForm;
