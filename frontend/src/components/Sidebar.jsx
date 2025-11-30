import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

const MENU = [
  { path: '/', label: 'Inicio', roles: [] },
  { path: '/productos', label: 'Productos', roles: ['repositor'] },
  { path: '/stock', label: 'Stock', roles: ['repositor'] },
  { path: '/ventas', label: 'Ventas', roles: ['cajero'] },
  { path: '/caja', label: 'Caja', roles: ['cajero'] },
  { path: '/reportes', label: 'Reportes', roles: ['admin'] },
  { path: '/configuracion', label: 'Configuración', roles: ['admin'] },
  { path: '/perfil', label: 'Perfil', roles: [] }
];

export default function Sidebar() {
  const { hasRole, user } = useAuth();

  const visible = MENU.filter((item) =>
    item.roles.length === 0 || hasRole('superadmin') || item.roles.some((role) => hasRole(role))
  );

  return (
    <aside
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border)',
        borderRadius: '1.2rem',
        padding: '1rem',
        minWidth: '240px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: 'var(--shadow)',
        height: '100%'
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Bienvenido</p>
        <p style={{ margin: 0, fontWeight: 700 }}>{user?.name || 'Usuario'}</p>
        {user?.role && <span className="badge">{user.role}</span>}
      </div>

      {visible.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({ textDecoration: 'none' })}
        >
          {({ isActive }) => (
            <Button
              full
              variant={isActive ? 'primary' : 'secondary'}
              size="lg"
              style={{ fontSize: '1rem' }}
            >
              {item.label}
            </Button>
          )}
        </NavLink>
      ))}
    </aside>
  );
}
