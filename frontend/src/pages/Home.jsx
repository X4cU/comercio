import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import Loader from '../components/Loader';
import api from '../services/api';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ventas: 0,
    utilidad: 0,
    ticket: 0,
    alertas: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejemplos de endpoints reales
        const [ventasRes, stockRes] = await Promise.all([
          api.get('/api/ventas?periodo=dia'),
          api.get('/api/stock/alertas')
        ]);

        setStats({
          ventas: ventasRes.data?.total || 0,
          utilidad: ventasRes.data?.utilidad || 0,
          ticket: ventasRes.data?.ticketPromedio || 0,
          alertas: stockRes.data?.alertas || 0
        });

        setChartData(
          ventasRes.data?.mensual || [
            { mes: 'Ene', monto: 12000 },
            { mes: 'Feb', monto: 14500 },
            { mes: 'Mar', monto: 16800 },
            { mes: 'Abr', monto: 15200 },
            { mes: 'May', monto: 21000 },
            { mes: 'Jun', monto: 23200 }
          ]
        );
      } catch (error) {
        console.error('Error cargando dashboard', error);
        setChartData([
          { mes: 'Ene', monto: 12000 },
          { mes: 'Feb', monto: 14500 },
          { mes: 'Mar', monto: 16800 },
          { mes: 'Abr', monto: 15200 },
          { mes: 'May', monto: 21000 },
          { mes: 'Jun', monto: 23200 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="grid card-grid">
        <Card title="Ventas del día" subtitle="Ingresos brutos">
          <div className="stat-value">${stats.ventas.toLocaleString('es-AR')}</div>
          <p className="stat-label">Cobros confirmados</p>
        </Card>
        <Card title="Utilidad estimada" subtitle="Margen operativo">
          <div className="stat-value">${stats.utilidad.toLocaleString('es-AR')}</div>
          <p className="stat-label">Basado en productos vendidos</p>
        </Card>
        <Card title="Ticket promedio" subtitle="Importe por venta">
          <div className="stat-value">${stats.ticket.toLocaleString('es-AR')}</div>
          <p className="stat-label">Comparado con la última semana</p>
        </Card>
        <Card title="Alertas de vencimiento" subtitle="Lotes próximos a vencer">
          <div className="stat-value">{stats.alertas}</div>
          <p className="stat-label">Productos requieren revisión</p>
        </Card>
      </div>

      <Card title="Evolución de ventas" subtitle="Últimos meses">
        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mes" stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--panel-light)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.8rem'
                }}
              />
              <Bar dataKey="monto" fill="url(#primaryGradient)" radius={[10, 10, 4, 4]} />
              <defs>
                <linearGradient id="primaryGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.9} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
