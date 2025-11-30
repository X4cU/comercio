import React from 'react';
import Button from './Button';
import PlaceholderImagen from './PlaceholderImagen';

export default function ProductoCard({ producto, onEditar, onToggle, isSuperAdmin }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        borderRadius: '1rem',
        border: '1px solid var(--border)',
        background: 'var(--panel)',
        boxShadow: 'var(--shadow)'
      }}
    >
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          style={{ width: 72, height: 72, borderRadius: '0.9rem', objectFit: 'cover' }}
        />
      ) : (
        <PlaceholderImagen size={72} />
      )}

      <div style={{ display: 'grid', gap: '0.25rem' }}>
        <div className="flex between">
          <div>
            <div style={{ fontWeight: 700 }}>{producto.nombre}</div>
            <small style={{ color: 'var(--muted)' }}>{producto.categoria || 'Sin categoría'}</small>
          </div>
          <span className="tag" style={{ background: producto.estado ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.15)', color: producto.estado ? '#a7f3d0' : '#fecdd3' }}>
            {producto.estado ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <span>Tipo: {producto.tipo || '—'}</span>
          <span>Unidad: {producto.unidad_venta || '—'}</span>
          <span>SKU: {producto.sku}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', color: 'var(--text)', fontWeight: 600 }}>
          <span>Precio: ${producto.precio_actual?.toLocaleString('es-AR') || '0'}</span>
          <span>Stock: {producto.stock_actual ?? 0}</span>
        </div>
        {isSuperAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Button variant="secondary" size="sm" onClick={() => onEditar(producto)}>
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onToggle(producto)}>
              {producto.estado ? 'Inactivar' : 'Activar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
