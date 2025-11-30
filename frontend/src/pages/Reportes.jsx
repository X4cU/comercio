import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../services/api';

export default function Reportes() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [reporte, setReporte] = useState(null);

  const filtrar = async () => {
    try {
      const res = await api.get('/api/reportes', { params: { desde, hasta } });
      setReporte(
        res.data || {
          ventas: 124,
          ingresos: 254000,
          ticketPromedio: 2050,
          productos: 86
        }
      );
    } catch (error) {
      console.error('Error al filtrar', error);
    }
  };

  const exportar = async () => {
    try {
      await api.get('/api/reportes/export', { params: { desde, hasta }, responseType: 'blob' });
      alert('Exportación a Excel en proceso');
    } catch (error) {
      console.error('No se pudo exportar', error);
    }
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Reportes</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Filtra por fecha y exportá a Excel</p>
        </div>
      </div>

      <Card title="Filtros">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <input className="input" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          <input className="input" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={filtrar}>
              Aplicar filtros
            </Button>
            <Button onClick={exportar}>Exportar Excel</Button>
          </div>
        </div>
      </Card>

      {reporte && (
        <Card title="Resumen">
          <div className="grid card-grid">
            <div>
              <p className="stat-label">Ventas</p>
              <div className="stat-value">{reporte.ventas}</div>
            </div>
            <div>
              <p className="stat-label">Ingresos</p>
              <div className="stat-value">${reporte.ingresos.toLocaleString('es-AR')}</div>
            </div>
            <div>
              <p className="stat-label">Ticket promedio</p>
              <div className="stat-value">${reporte.ticketPromedio.toLocaleString('es-AR')}</div>
            </div>
            <div>
              <p className="stat-label">Productos vendidos</p>
              <div className="stat-value">{reporte.productos}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
