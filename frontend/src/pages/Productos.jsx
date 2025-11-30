import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import api from '../services/api';

const categories = ['Bebidas', 'Almacén', 'Limpieza', 'Frescos'];

export default function Productos() {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get('/api/productos');
        setProductos(
          res.data || [
            { id: 1, nombre: 'Café en grano', categoria: 'Almacén', precio: 2500, stock: 35 },
            { id: 2, nombre: 'Leche descremada', categoria: 'Frescos', precio: 950, stock: 60 },
            { id: 3, nombre: 'Detergente', categoria: 'Limpieza', precio: 1450, stock: 42 },
            { id: 4, nombre: 'Gaseosa lima', categoria: 'Bebidas', precio: 1200, stock: 20 },
            { id: 5, nombre: 'Aceite de oliva', categoria: 'Almacén', precio: 3200, stock: 15 },
            { id: 6, nombre: 'Yogur natural', categoria: 'Frescos', precio: 780, stock: 28 },
            { id: 7, nombre: 'Lavandina', categoria: 'Limpieza', precio: 980, stock: 51 },
            { id: 8, nombre: 'Agua con gas', categoria: 'Bebidas', precio: 620, stock: 70 },
            { id: 9, nombre: 'Miel orgánica', categoria: 'Almacén', precio: 2100, stock: 12 }
          ]
        );
      } catch (error) {
        console.error('Error cargando productos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const filtered = useMemo(() => {
    return productos
      .filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => (categoria ? p.categoria === categoria : true));
  }, [productos, query, categoria]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const current = filtered.slice(start, start + perPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await api.post('/api/productos', data);
      setProductos((prev) => [...prev, res.data || { ...data, id: prev.length + 1, stock: 0 }]);
      setModal(false);
    } catch (error) {
      console.error('No se pudo crear el producto', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Productos</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Gestioná el catálogo y precios</p>
        </div>
        <Button onClick={() => setModal(true)}>Nuevo producto</Button>
      </div>

      <Card>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            className="input"
            placeholder="Buscar por nombre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" full onClick={() => setPage(1)}>
              Reiniciar filtros
            </Button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {current.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>
                  <span className="badge">{p.categoria}</span>
                </td>
                <td>${p.precio.toLocaleString('es-AR')}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="section-heading" style={{ marginTop: '1rem' }}>
          <p style={{ color: 'var(--muted)' }}>
            Página {page} de {totalPages}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </Button>
            <Button variant="secondary" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="section-heading">
              <h3 className="section-title">Nuevo producto</h3>
              <Button variant="ghost" onClick={() => setModal(false)}>
                Cerrar
              </Button>
            </div>
            <form className="grid" style={{ gap: '0.75rem' }} onSubmit={handleSubmit}>
              <input className="input" name="nombre" placeholder="Nombre" required />
              <input className="input" name="precio" placeholder="Precio" type="number" min="0" step="0.01" required />
              <select className="input" name="categoria" required>
                <option value="">Seleccioná categoría</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input className="input" name="stock" placeholder="Stock inicial" type="number" min="0" />
              <Button type="submit" full>
                Guardar
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
