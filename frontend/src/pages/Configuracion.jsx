import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../services/api';

export default function Configuracion() {
  const [logo, setLogo] = useState(null);
  const [tema, setTema] = useState('oscuro');
  const [mensaje, setMensaje] = useState('');

  const guardar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (logo) formData.append('logo', logo);
    formData.append('tema', tema);

    try {
      await api.post('/api/configuracion', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMensaje('Configuración guardada');
    } catch (error) {
      setMensaje('No se pudo guardar');
    }
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Configuración</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Personalizá la marca y colores</p>
        </div>
      </div>

      <Card title="Branding">
        <form className="grid" style={{ gap: '0.75rem', maxWidth: '520px' }} onSubmit={guardar}>
          <div>
            <p style={{ margin: 0, color: 'var(--muted)' }}>Subir logo</p>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              style={{ padding: '0.6rem' }}
            />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--muted)' }}>Tema del sistema</p>
            <div className="flex gap" style={{ marginTop: '0.5rem' }}>
              <Button variant={tema === 'oscuro' ? 'primary' : 'secondary'} onClick={() => setTema('oscuro')}>
                Oscuro
              </Button>
              <Button variant={tema === 'claro' ? 'primary' : 'secondary'} onClick={() => setTema('claro')}>
                Claro
              </Button>
            </div>
          </div>
          <Button type="submit" style={{ marginTop: '0.5rem' }}>
            Guardar cambios
          </Button>
          {mensaje && <p style={{ color: 'var(--muted)' }}>{mensaje}</p>}
        </form>
      </Card>
    </div>
  );
}
