import React from 'react';

export default function Loader({ label = 'Cargando...' }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.08)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>{label}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
