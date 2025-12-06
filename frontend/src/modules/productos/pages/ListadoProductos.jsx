import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useProductosStore } from '../../../store/productosStore';
import { ProductFilters } from '../components/ProductFilters';
import { ProductTable } from '../components/ProductTable';
import { ProductStats } from '../components/ProductStats';

const PAGE_SIZE = 5;

export default function ListadoProductos() {
  const { productos, loading, getProductos, eliminarProducto } = useProductosStore();
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (productos.length === 0) getProductos();
  }, [getProductos, productos.length]);

  useEffect(() => {
    setPage(1);
  }, [search, categoria, estado]);

  const filtered = useMemo(() => {
    return productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(search.toLowerCase());
      const matchesCategoria = categoria ? producto.categoria === categoria : true;
      const matchesEstado = estado
        ? estado === 'activo'
          ? producto.estado
          : !producto.estado
        : true;
      return matchesSearch && matchesCategoria && matchesEstado;
    });
  }, [productos, search, categoria, estado]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = [
    {
      id: 'total',
      label: 'Productos totales',
      value: productos.length,
      accent: 'bg-emerald-500'
    },
    {
      id: 'activos',
      label: 'Activos',
      value: productos.filter((p) => p.estado).length,
      accent: 'bg-cyan-500'
    },
    {
      id: 'stock',
      label: 'Stock promedio',
      value: Math.round(
        productos.reduce((acc, p) => acc + Number(p.stock_actual || 0), 0) / (productos.length || 1)
      ),
      accent: 'bg-amber-500',
      sub: 'Vs stock óptimo por producto'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Inventario</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Productos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Control completo de productos, imágenes y stock óptimo.</p>
        </div>
        <Link to="/productos/nuevo" className="btn-primary">
          <PlusCircleIcon className="h-5 w-5" />
          Nuevo producto
        </Link>
      </div>

      <ProductStats stats={stats} />

      <ProductFilters
        search={search}
        categoria={categoria}
        estado={estado}
        onSearch={setSearch}
        onCategoria={setCategoria}
        onEstado={setEstado}
      />

      <ProductTable
        productos={paginated}
        onEliminar={(producto) => eliminarProducto(producto.id)}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {loading && <p className="text-sm text-gray-500">Cargando productos...</p>}
    </div>
  );
}
