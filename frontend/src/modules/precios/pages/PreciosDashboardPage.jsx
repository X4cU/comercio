import React, { useEffect, useMemo, useState } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getProductosLite } from '../../productos/services/productosService';
import { preciosService } from '../services/preciosService';
import { ofertasService } from '../services/ofertasService';
import PrecioCard from '../components/PrecioCard';
import PrecioForm from '../components/PrecioForm';
import OfertaForm from '../components/OfertaForm';

export default function PreciosDashboardPage() {
  const [productos, setProductos] = useState([]);
  const [precios, setPrecios] = useState({});
  const [ofertasPorProducto, setOfertasPorProducto] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [productoParaPrecio, setProductoParaPrecio] = useState(null);
  const [productoParaOferta, setProductoParaOferta] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      const listaProductos = await getProductosLite();
      const preciosMap = await preciosService.getAllPrecios();
      const ofertasMap = {};

      await Promise.all(
        listaProductos.map(async (producto) => {
          preciosMap[producto.id] = preciosMap[producto.id] || (await preciosService.getPrecio(producto.id));
          const ofertas = await ofertasService.getOfertasPorProducto(producto.id);
          ofertasMap[producto.id] = ofertas.map((oferta) => ({
            ...oferta,
            precioFinal: ofertasService.calcularPrecioFinal(preciosMap[producto.id], oferta, preciosMap[producto.id]?.precioVenta).precioFinal,
            porcentajeAplicado: ofertasService.calcularPrecioFinal(preciosMap[producto.id], oferta, preciosMap[producto.id]?.precioVenta).porcentajeAplicado
          }));
        })
      );

      setProductos(listaProductos);
      setPrecios(preciosMap);
      setOfertasPorProducto(ofertasMap);
    };

    cargarDatos();
  }, []);

  const categorias = useMemo(() => Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean))), [productos]);
  const subcategorias = useMemo(() => Array.from(new Set(productos.map((p) => p.subcategoria).filter(Boolean))), [productos]);

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCat = !categoria || p.categoria === categoria;
      const coincideSub = !subcategoria || p.subcategoria === subcategoria;
      return coincideBusqueda && coincideCat && coincideSub;
    });
  }, [productos, busqueda, categoria, subcategoria]);

  const ofertaActivaDe = (productoId) => {
    const ofertas = ofertasPorProducto[productoId] || [];
    return ofertas.find((o) => o.estado === 'activa') || ofertas.find((o) => o.estado === 'programada') || null;
  };

  const handleGuardarPrecio = async (payload) => {
    if (!productoParaPrecio) return;
    try {
      const nuevo = await preciosService.setPrecio(productoParaPrecio.id, payload.precioCompra, payload.precioVenta);
      setPrecios((prev) => ({ ...prev, [productoParaPrecio.id]: nuevo }));
      setMensaje('Precio actualizado correctamente');
      setProductoParaPrecio(null);
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const handleCrearOferta = async (oferta) => {
    if (!productoParaOferta) return;
    try {
      const creada = await ofertasService.crearOferta(oferta);
      const calculo = ofertasService.calcularPrecioFinal(
        precios[productoParaOferta.id],
        { ...creada, tipo: oferta.tipo, valor: oferta.valor },
        precios[productoParaOferta.id]?.precioVenta
      );
      setOfertasPorProducto((prev) => ({
        ...prev,
        [productoParaOferta.id]: [
          { ...creada, ...calculo },
          ...(prev[productoParaOferta.id] || [])
        ]
      }));
      setProductoParaOferta(null);
      setMensaje('Oferta registrada');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">Comercial</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Gestión de precios y ofertas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Administra precios de compra/venta, ofertas activas y programadas con control de vigencia.</p>
      </div>

      <div className="card flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            <input
              className="border-none bg-transparent p-0 text-sm shadow-none focus:ring-0"
              placeholder="Buscar producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
            <FunnelIcon className="h-5 w-5" />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)}>
              <option value="">Todas las subcategorías</option>
              {subcategorias.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        {mensaje && <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">{mensaje}</div>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((producto) => (
          <PrecioCard
            key={producto.id}
            producto={producto}
            precio={precios[producto.id]}
            ofertaActiva={ofertaActivaDe(producto.id)}
            onEditar={setProductoParaPrecio}
            onCrearOferta={setProductoParaOferta}
          />
        ))}
        {filtrados.length === 0 && <div className="col-span-full text-sm text-gray-500">Sin resultados</div>}
      </div>

      {(productoParaPrecio || productoParaOferta) && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Acción rápida</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                {productoParaPrecio ? 'Editar precio' : 'Crear nueva oferta'} - {(productoParaPrecio || productoParaOferta)?.nombre}
              </h2>
            </div>
            <button className="btn-ghost" onClick={() => { setProductoParaPrecio(null); setProductoParaOferta(null); }}>
              Cerrar
            </button>
          </div>

          {productoParaPrecio && (
            <PrecioForm
              initialData={precios[productoParaPrecio.id]}
              onSubmit={handleGuardarPrecio}
              onCancel={() => setProductoParaPrecio(null)}
            />
          )}

          {productoParaOferta && (
            <OfertaForm
              productoSeleccionado={productoParaOferta}
              onSubmit={(payload) => handleCrearOferta({ ...payload, productoId: productoParaOferta.id })}
              onCancel={() => setProductoParaOferta(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
