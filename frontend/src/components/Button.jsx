import React from 'react';

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#0b1220'
  },
  ghost: {
    background: 'transparent',
    color: '#e5e7eb',
    border: '1px solid rgba(255,255,255,0.12)'
  },
  secondary: {
    background: '#1f2937',
    color: '#e5e7eb',
    border: '1px solid rgba(255,255,255,0.08)'
  }
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full,
  onClick,
  type = 'button',
  disabled,
  icon
}) {
  const style = variants[variant] || variants.primary;
  const padding = {
    sm: '0.5rem 0.85rem',
    md: '0.85rem 1.1rem',
    lg: '1rem 1.2rem'
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        padding,
        width: full ? '100%' : 'auto',
        border: style.border || 'none',
        borderRadius: '0.9rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 700,
        fontSize: '0.95rem',
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.65 : 1,
        boxShadow: variant === 'primary' ? '0 10px 30px rgba(34,197,94,0.25)' : 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = disabled ? 'none' : 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
      }}
    >
      {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
      {children}
    </button>
  );
}
