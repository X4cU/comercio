import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListBulletIcon, Squares2X2Icon, FunnelIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { ProductoTable } from '../components/ProductoTable';
import { ProductoCard } from '../components/ProductoCard';
import { productosService } from '../services/productosService';
import { categoriasService } from '../../categorias/services/categoriasService';

export default function ProductosPage() {
  const navigate = useNavigate();
  const [vista, setVista] = useState('tabla');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({ search: '', categoriaId: '', subcategoriaId: '' });

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          productosService.getProductos(),
          categoriasService.getCategorias()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const subcategoriasFiltradas = useMemo(() => {
    const categoria = categorias.find((item) => item.id === filtros.categoriaId);
    return categoria?.subcategorias || [];
  }, [categorias, filtros.categoriaId]);

  const productosDecorados = useMemo(() => {
    return productos.map((producto) => {
      const categoria = categorias.find((cat) => cat.id === producto.categoriaId);
      const subcategoria = categoria?.subcategorias.find((sub) => sub.id === producto.subcategoriaId);
      return {
        ...producto,
        categoriaNombre: categoria?.nombre || 'Sin categoría',
        subcategoriaNombre: subcategoria?.nombre || ''
      };
    });
  }, [productos, categorias]);

  const productosFiltrados = useMemo(() => {
    return productosDecorados.filter((producto) => {
      const matchesSearch = producto.nombre.toLowerCase().includes(filtros.search.toLowerCase());
      const matchesCategoria = filtros.categoriaId ? producto.categoriaId === filtros.categoriaId : true;
      const matchesSubcategoria = filtros.subcategoriaId ? producto.subcategoriaId === filtros.subcategoriaId : true;
      return matchesSearch && matchesCategoria && matchesSubcategoria;
    });
  }, [productosDecorados, filtros]);

  const handleEliminar = async (producto) => {
    await productosService.deleteProducto(producto.id);
    setProductos((prev) => prev.filter((item) => item.id !== producto.id));
  };

  const handleEdit = (producto) => {
    navigate(`/productos/${producto.id}/editar`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Inventario</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Productos</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Registra, edita y controla productos con filtros rápidos y vista tabla o tarjetas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <button
              type="button"
              className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-semibold transition ${
                vista === 'tabla'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={() => setVista('tabla')}
            >
              <ListBulletIcon className="h-4 w-4" />
              Tabla
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-semibold transition ${
                vista === 'cards'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={() => setVista('cards')}
            >
              <Squares2X2Icon className="h-4 w-4" />
              Cards
            </button>
          </div>
          <Link to="/productos/nuevo" className="btn-primary flex items-center gap-2">
            <PlusCircleIcon className="h-5 w-5" />
            Nuevo Producto
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <FunnelIcon className="h-4 w-4" />
          Filtros rápidos
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Buscar por nombre"
              className="w-full border rounded-md px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              value={filtros.search}
              onChange={(e) => setFiltros((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            value={filtros.categoriaId}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                categoriaId: e.target.value,
                subcategoriaId: ''
              }))
            }
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            value={filtros.subcategoriaId}
            onChange={(e) => setFiltros((prev) => ({ ...prev, subcategoriaId: e.target.value }))}
            disabled={!filtros.categoriaId}
          >
            <option value="">Todas las subcategorías</option>
            {subcategoriasFiltradas.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {vista === 'tabla' ? (
        <ProductoTable productos={productosFiltrados} onEdit={handleEdit} onDelete={handleEliminar} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              categoriaNombre={producto.categoriaNombre}
              subcategoriaNombre={producto.subcategoriaNombre}
              onEdit={handleEdit}
              onDelete={handleEliminar}
            />
          ))}
          {productosFiltrados.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-gray-200 p-6 text-center text-gray-500 dark:border-gray-800 dark:text-gray-400">
              No hay productos para mostrar.
            </div>
          )}
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Cargando productos...</p>
      )}
    </div>
  );
}
