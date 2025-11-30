import React from 'react';

export default function PlaceholderImagen({ size = 52 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '0.75rem',
        background: 'linear-gradient(135deg, #1f2937, #0b1220)',
        display: 'grid',
        placeItems: 'center',
        color: '#9ca3af',
        fontSize: '0.8rem',
        border: '1px dashed rgba(255,255,255,0.12)'
      }}
    >
      Sin imagen
    </div>
  );
}
