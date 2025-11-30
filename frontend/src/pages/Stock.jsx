import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import api from '../services/api';

export default function Stock() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await api.get('/api/stock');
        setItems(
          res.data || [
            { id: 1, nombre: 'Café en grano', stock: 35, optimo: 50 },
            { id: 2, nombre: 'Leche descremada', stock: 18, optimo: 40 },
            { id: 3, nombre: 'Detergente', stock: 5, optimo: 30 },
            { id: 4, nombre: 'Gaseosa lima', stock: 72, optimo: 60 }
          ]
        );
      } catch (error) {
        console.error('Error cargando stock', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const calcularEstado = (item) => {
    const porcentaje = Math.round((item.stock / item.optimo) * 100);
    if (porcentaje < 40) return { label: 'Crítico', color: '#f87171' };
    if (porcentaje < 80) return { label: 'Atención', color: '#fbbf24' };
    return { label: 'Saludable', color: '#22c55e' };
  };

  if (loading) return <Loader />;

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Stock</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Controlá existencias y mermas</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary">Registrar merma</Button>
          <Button>Registrar mercadería nueva</Button>
        </div>
      </div>

      <Card>
        <div className="card-list">
          {items.map((item) => {
            const estado = calcularEstado(item);
            const porcentaje = Math.min(100, Math.round((item.stock / item.optimo) * 100));
            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{item.nombre}</p>
                  <p style={{ margin: 0, color: 'var(--muted)' }}>Stock óptimo: {item.optimo}</p>
                </div>
                <div>
                  <div className="badge" style={{ color: estado.color }}>
                    {estado.label}
                  </div>
                  <div className="progress" style={{ marginTop: '0.5rem' }}>
                    <span style={{ width: `${porcentaje}%` }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>{item.stock}</p>
                  <p style={{ margin: 0, color: 'var(--muted)' }}>Unidades disponibles</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
