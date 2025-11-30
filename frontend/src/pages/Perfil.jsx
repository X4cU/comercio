import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';

export default function Perfil() {
  const { user } = useAuth();

  const cambiarPassword = () => {
    authService.keycloak.accountManagement();
  };

  return (
    <div className="grid" style={{ gap: '1rem', maxWidth: '720px' }}>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Perfil</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Datos del usuario autenticado</p>
        </div>
      </div>

      <Card>
        <div className="flex gap" style={{ alignItems: 'center' }}>
          <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.25rem' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>{user?.name}</p>
            <p style={{ margin: 0, color: 'var(--muted)' }}>{user?.email}</p>
            <span className="badge">{user?.role}</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Button variant="secondary" onClick={cambiarPassword}>
            Cambiar contraseña en Keycloak
          </Button>
        </div>
      </Card>
    </div>
  );
}
