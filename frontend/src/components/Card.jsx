import React from 'react';

export default function Card({ title, subtitle, children, footer, actions }) {
  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: '1.1rem',
        padding: '1.25rem',
        boxShadow: 'var(--shadow)',
        minHeight: '120px'
      }}
    >
      {(title || actions) && (
        <div className="section-heading" style={{ marginBottom: '0.75rem' }}>
          <div>
            {title && <h3 className="section-title" style={{ fontSize: '1.1rem' }}>{title}</h3>}
            {subtitle && <p style={{ color: 'var(--muted)', margin: '0.25rem 0 0' }}>{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div style={{ marginTop: '1rem' }}>{footer}</div>}
    </div>
  );
}
