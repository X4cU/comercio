import React, { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const catalogo = [
  { id: 1, nombre: 'Café en grano', precio: 2500 },
  { id: 2, nombre: 'Leche descremada', precio: 950 },
  { id: 3, nombre: 'Gaseosa lima', precio: 1200 },
  { id: 4, nombre: 'Yogur natural', precio: 780 },
  { id: 5, nombre: 'Miel orgánica', precio: 2100 },
  { id: 6, nombre: 'Detergente', precio: 1450 }
];

const pagos = ['Efectivo', 'Débito', 'Crédito', 'Transferencia'];

export default function Ventas() {
  const [search, setSearch] = useState('');
  const [ticket, setTicket] = useState([]);
  const [metodo, setMetodo] = useState(pagos[0]);

  const productosFiltrados = useMemo(
    () => catalogo.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const total = useMemo(() => ticket.reduce((acc, item) => acc + item.precio * item.cantidad, 0), [ticket]);

  const addItem = (producto) => {
    setTicket((prev) => {
      const exists = prev.find((p) => p.id === producto.id);
      if (exists) {
        return prev.map((p) => (p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p));
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const updateCantidad = (id, delta) => {
    setTicket((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const cobrar = () => {
    alert(`Venta registrada por $${total.toLocaleString('es-AR')} con ${metodo}`);
    setTicket([]);
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Ventas</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Interfaz POS táctil</p>
        </div>
        <div className="badge">Método: {metodo}</div>
      </div>

      <div className="pos-layout">
        <Card title="Productos">
          <input
            className="input"
            placeholder="Buscar producto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {productosFiltrados.map((p) => (
              <Button key={p.id} full onClick={() => addItem(p)}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800 }}>{p.nombre}</div>
                  <div style={{ color: 'var(--muted)' }}>${p.precio.toLocaleString('es-AR')}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        <Card title="Ticket actual">
          <div className="card-list">
            {ticket.length === 0 && <p style={{ color: 'var(--muted)' }}>Agregá productos para comenzar</p>}
            {ticket.map((item) => (
              <div key={item.id} className="flex between" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.9rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{item.nombre}</p>
                  <p style={{ margin: 0, color: 'var(--muted)' }}>${item.precio.toLocaleString('es-AR')}</p>
                </div>
                <div className="flex gap">
                  <Button variant="ghost" onClick={() => updateCantidad(item.id, -1)}>
                    -
                  </Button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700 }}>{item.cantidad}</span>
                  <Button variant="ghost" onClick={() => updateCantidad(item.id, 1)}>
                    +
                  </Button>
                </div>
                <div style={{ fontWeight: 800 }}>${(item.precio * item.cantidad).toLocaleString('es-AR')}</div>
              </div>
            ))}
          </div>

          <div className="section-heading" style={{ marginTop: '1rem' }}>
            <select className="input" value={metodo} onChange={(e) => setMetodo(e.target.value)} style={{ maxWidth: '220px' }}>
              {pagos.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Total</p>
              <div className="stat-value">${total.toLocaleString('es-AR')}</div>
            </div>
          </div>

          <Button full size="lg" onClick={cobrar} disabled={ticket.length === 0}>
            COBRAR
          </Button>
        </Card>
      </div>
    </div>
  );
}
