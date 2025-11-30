import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import PlaceholderImagen from '../components/PlaceholderImagen';
import ProductoModal from '../components/ProductoModal';
import ProductoCard from '../components/ProductoCard';
import { productosService } from '../services/productos';
import { useAuth } from '../hooks/useAuth';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const { hasRole } = useAuth();
  const isSuperAdmin = hasRole('superadmin');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productosService.getProductos();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const activos = productos.filter((p) => p.estado).length;
    const inactivos = productos.length - activos;
    return [
      { label: 'Activos', value: activos, accent: '#22c55e' },
      { label: 'Inactivos', value: inactivos, accent: '#f97316' },
      { label: 'Total', value: productos.length, accent: '#38bdf8' }
    ];
  }, [productos]);

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      const matchesQuery = p.nombre.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesEstado =
        estadoFiltro === 'todos' || (estadoFiltro === 'activos' && p.estado) || (estadoFiltro === 'inactivos' && !p.estado);
      return matchesQuery && matchesEstado;
    });
  }, [productos, query, estadoFiltro]);

  const handleSave = async (formData) => {
    setError(null);
    try {
      if (editing) {
        const updated = await productosService.actualizarProducto(editing.id, formData);
        setProductos((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const created = await productosService.crearProducto(formData);
        setProductos((prev) => [...prev, created]);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleEstado = async (producto) => {
    setError(null);
    try {
      const updated = await productosService.cambiarEstadoProducto(producto.id);
      setProductos((prev) => prev.map((p) => (p.id === producto.id ? updated : p)));
    } catch (err) {
      setError(err.message);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (producto) => {
    setEditing(producto);
    setModalOpen(true);
  };

  if (loading) return <Loader label="Cargando productos" />;

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Productos</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Módulo oscuro con gestión centralizada de catálogo. Stock y precios se muestran en solo lectura.
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreate} icon="＋">
            Nuevo producto
          </Button>
        )}
      </div>

      <div className="grid card-grid">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            title={stat.label}
            subtitle="Resumen"
            actions={
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '999px',
                  display: 'inline-block',
                  background: stat.accent,
                }}
              />
            }
          >
            <div className="stat-value">{stat.value}</div>
            <p className="stat-label">{stat.label === 'Total' ? 'Productos registrados' : 'Estado actual'}</p>
          </Card>
        ))}
      </div>

      <Card
        title="Listado"
        subtitle="Catálogo limpio y moderno"
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              className="input"
              placeholder="Buscar por nombre o SKU"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: 260 }}
            />
            <select className="input" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} style={{ width: 180 }}>
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
        }
      >
        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '0.8rem',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#fecdd3',
              marginBottom: '0.75rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ minWidth: '840px' }}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Precio actual</th>
                <th>Stock actual</th>
                {isSuperAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    {producto.imagen_url ? (
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        style={{ width: 48, height: 48, borderRadius: '0.8rem', objectFit: 'cover' }}
                      />
                    ) : (
                      <PlaceholderImagen />
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>{producto.nombre}</td>
                  <td>{producto.categoria || '—'}</td>
                  <td>{producto.tipo || '—'}</td>
                  <td>{producto.unidad_venta || '—'}</td>
                  <td>
                    <span
                      className="tag"
                      style={{
                        background: producto.estado ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.15)',
                        color: producto.estado ? '#a7f3d0' : '#fecdd3',
                      }}
                    >
                      {producto.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>${Number(producto.precio_actual ?? 0).toLocaleString('es-AR')}</td>
                  <td>{producto.stock_actual ?? 0}</td>
                  {isSuperAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="secondary" size="sm" onClick={() => openEdit(producto)}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleEstado(producto)}>
                          {producto.estado ? 'Inactivar' : 'Activar'}
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid card-grid" style={{ marginTop: '1rem' }}>
          {filtered.map((producto) => (
            <ProductoCard
              key={`${producto.id}-card`}
              producto={producto}
              onEditar={openEdit}
              onToggle={handleToggleEstado}
              isSuperAdmin={isSuperAdmin}
            />
          ))}
        </div>
      </Card>

      <ProductoModal
        open={modalOpen}
        isEditing={!!editing}
        initialData={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}
