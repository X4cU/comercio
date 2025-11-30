import React from 'react';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: '0.85rem 1rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div className="avatar">POS</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>Comercio</p>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Panel de gestión</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>{user?.name || 'Usuario'}</p>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{user?.role || 'Sin rol'}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
