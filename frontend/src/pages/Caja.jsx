import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import api from '../services/api';

export default function Caja() {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [costos, setCostos] = useState(0);
  const [cierreEnviado, setCierreEnviado] = useState(false);

  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const res = await api.get('/api/caja/dia');
        setVentas(
          res.data?.ventas || [
            { id: 1, hora: '09:12', monto: 4200 },
            { id: 2, hora: '12:44', monto: 11000 },
            { id: 3, hora: '15:30', monto: 7600 },
            { id: 4, hora: '18:05', monto: 6400 }
          ]
        );
        setCostos(res.data?.costosFijos || 3500);
      } catch (error) {
        console.error('Error cargando caja', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaja();
  }, []);

  const totalVentas = ventas.reduce((acc, v) => acc + v.monto, 0);
  const neto = totalVentas - costos;

  const enviarCierre = async () => {
    try {
      await api.post('/api/caja/cierre', { total: totalVentas, costos });
      setCierreEnviado(true);
    } catch (error) {
      console.error('No se pudo enviar el cierre', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Caja</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Ventas del día y cierre</p>
        </div>
      </div>

      <div className="split">
        <Card title="Ventas del día">
          <div className="card-list">
            {ventas.map((v) => (
              <div key={v.id} className="flex between" style={{ padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--muted)' }}>{v.hora}</span>
                <span style={{ fontWeight: 700 }}>${v.monto.toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Resumen" subtitle="Incluye costos fijos">
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>Costos fijos</p>
          <input
            className="input"
            type="number"
            value={costos}
            onChange={(e) => setCostos(Number(e.target.value))}
            style={{ marginBottom: '1rem' }}
          />
          <div className="flex between">
            <span>Total ventas</span>
            <span style={{ fontWeight: 700 }}>${totalVentas.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex between" style={{ marginTop: '0.5rem' }}>
            <span>Neto estimado</span>
            <span className="stat-value" style={{ fontSize: '1.4rem' }}>${neto.toLocaleString('es-AR')}</span>
          </div>
          <Button full style={{ marginTop: '1rem' }} onClick={enviarCierre} disabled={cierreEnviado}>
            {cierreEnviado ? 'Cierre enviado' : 'Registrar cierre de caja'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
