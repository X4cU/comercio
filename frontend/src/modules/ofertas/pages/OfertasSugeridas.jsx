import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdjustmentsHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { TarjetaOfertaSugerida } from '../components/TarjetaOfertaSugerida';
import { TablaOfertasVigentes } from '../components/TablaOfertasVigentes';
import { useOfertasStore } from '../store/useOfertasStore';

export default function OfertasSugeridas() {
  const navigate = useNavigate();
  const { ofertasSugeridas, ofertas, cargarOfertasSugeridas, cargarOfertas, finalizarOferta } = useOfertasStore();
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    if (ofertasSugeridas.length === 0) cargarOfertasSugeridas();
    if (ofertas.length === 0) cargarOfertas();
  }, [cargarOfertas, cargarOfertasSugeridas, ofertas.length, ofertasSugeridas.length]);

  const categoriasDisponibles = useMemo(() => {
    const setCategorias = new Set(ofertasSugeridas.map((o) => o.categoria));
    return Array.from(setCategorias);
  }, [ofertasSugeridas]);

  const sugerenciasFiltradas = useMemo(() => {
    return ofertasSugeridas.filter((item) => {
      const matchesTipo = tipo ? item.estado_stock === tipo : true;
      const matchesCategoria = categoria ? item.categoria === categoria : true;
      return matchesTipo && matchesCategoria;
    });
  }, [categoria, ofertasSugeridas, tipo]);

  const ofertasVigentes = useMemo(() => ofertas.filter((o) => o.estado === 'VIGENTE'), [ofertas]);

  const handleCrearOferta = (producto) => {
    navigate('/ofertas/nueva', { state: { producto } });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Comercial</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ofertas sugeridas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Priorizamos perecederos críticos para activar ofertas y liquidaciones con impacto inmediato en merma y margen.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/ofertas/nueva')}>
            Crear oferta manual
          </button>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-emerald-500" />
            Filtros rápidos
          </div>
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => {
              setTipo('');
              setCategoria('');
            }}
          >
            <ArrowPathIcon className="h-4 w-4" />
            Limpiar
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo sugerencia</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1 w-full">
              <option value="">Todos</option>
              <option value="OFERTA">OFERTA</option>
              <option value="LIQUIDACION">LIQUIDACION</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 w-full">
              <option value="">Todas</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end text-sm text-gray-600 dark:text-gray-300">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{sugerenciasFiltradas.length} sugerencias</p>
            <p className="text-xs text-gray-500">Prioriza las de 1-2 días restantes</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sugerenciasFiltradas.map((item) => (
          <TarjetaOfertaSugerida key={item.productoId} data={item} onCrear={handleCrearOferta} />
        ))}
        {sugerenciasFiltradas.length === 0 && (
          <div className="card text-sm text-gray-600 dark:text-gray-300">No hay sugerencias que coincidan con los filtros.</div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Seguimiento</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ofertas vigentes</h2>
          </div>
          <span className="badge">{ofertasVigentes.length} activas</span>
        </div>
        <TablaOfertasVigentes ofertas={ofertasVigentes} onFinalizar={finalizarOferta} />
      </div>
    </div>
  );
}
