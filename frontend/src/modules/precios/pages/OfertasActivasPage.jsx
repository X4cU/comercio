import React, { useEffect, useMemo, useState } from 'react';
import { getProductosLite } from '../../productos/services/productosService';
import { ofertasService } from '../services/ofertasService';
import OfertaCard from '../components/OfertaCard';

export default function OfertasActivasPage() {
  const [ofertas, setOfertas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroProducto, setFiltroProducto] = useState('');

  const cargar = async () => {
    const [activa, programada, expirada, productosLite] = await Promise.all([
      ofertasService.getOfertasActivas(),
      ofertasService.getOfertasProgramadas(),
      ofertasService.getOfertasExpiradas(),
      getProductosLite()
    ]);

    setOfertas([
      ...activa.map((o) => ({ ...o, estado: 'activa' })),
      ...programada.map((o) => ({ ...o, estado: 'programada' })),
      ...expirada.map((o) => ({ ...o, estado: 'expirada' }))
    ]);
    setProductos(productosLite);
  };

  useEffect(() => {
    cargar();
  }, []);

  const productosMap = useMemo(() => Object.fromEntries(productos.map((p) => [p.id, p])), [productos]);

  const filtradas = useMemo(() => {
    return ofertas.filter((o) => {
      const coincideEstado = filtroEstado === 'todas' || o.estado === filtroEstado;
      const coincideProducto = !filtroProducto || o.productoId === filtroProducto;
      return coincideEstado && coincideProducto;
    });
  }, [ofertas, filtroEstado, filtroProducto]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Ofertas</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Ofertas activas y vigencias</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Filtra por estado, identifica vigencia y desactiva campañas visualmente.</p>
      </div>

      <div className="card flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label>Estado</label>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="activa">Solo activas</option>
              <option value="programada">Programadas</option>
              <option value="expirada">Expiradas</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label>Producto</label>
            <select value={filtroProducto} onChange={(e) => setFiltroProducto(e.target.value)}>
              <option value="">Todos</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtradas.map((oferta) => (
          <OfertaCard
            key={oferta.id}
            oferta={{
              ...oferta,
              precioBase: oferta.precioBase ?? productosMap[oferta.productoId]?.precioVenta,
              precioFinal: ofertasService.calcularPrecioFinal(
                productosMap[oferta.productoId],
                oferta,
                productosMap[oferta.productoId]?.precioVenta
              ).precioFinal,
              porcentajeAplicado: ofertasService.calcularPrecioFinal(
                productosMap[oferta.productoId],
                oferta,
                productosMap[oferta.productoId]?.precioVenta
              ).porcentajeAplicado
            }}
            producto={productosMap[oferta.productoId]}
            onDesactivar={() => {}}
          />
        ))}
        {filtradas.length === 0 && <div className="text-sm text-gray-500">No hay ofertas para este filtro.</div>}
      </div>
    </div>
  );
}
