import React, { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import PlaceholderImagen from './PlaceholderImagen';

const initialState = {
  nombre: '',
  categoria: '',
  unidad_venta: '',
  tipo: '',
  sku: '',
  descripcion: '',
  estado: true,
  precio_actual: 0,
  stock_actual: 0,
};

export default function ProductoModal({ open, onClose, onSubmit, initialData, isEditing }) {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialState, ...initialData });
      setPreview(initialData.imagen_url || null);
    } else if (open) {
      setForm(initialState);
      setPreview(null);
      setFile(null);
    }
  }, [initialData, open]);

  const title = useMemo(() => (isEditing ? 'Editar producto' : 'Crear producto'), [isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFile = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (['precio_actual', 'stock_actual'].includes(key)) return;
      formData.append(key, value ?? '');
    });
    if (file) {
      formData.append('imagen', file);
    }
    onSubmit(formData, form);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{ animation: 'fadeIn 0.2s ease' }}>
      <div className="modal" style={{ animation: 'popIn 0.25s ease' }}>
        <div className="section-heading">
          <h3 className="section-title" style={{ fontSize: '1.2rem' }}>
            {title}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>

        <form className="grid" style={{ gap: '0.75rem' }} onSubmit={handleSubmit}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Nombre *</label>
              <input
                className="input"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>SKU / Código *</label>
              <input
                className="input"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                placeholder="Código único"
              />
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Categoría</label>
              <input className="input" name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Tipo</label>
              <input className="input" name="tipo" value={form.tipo} onChange={handleChange} placeholder="Tipo" />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Unidad de venta</label>
              <input
                className="input"
                name="unidad_venta"
                value={form.unidad_venta}
                onChange={handleChange}
                placeholder="kg, unidad, pack..."
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Descripción</label>
            <textarea
              className="input"
              name="descripcion"
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Notas internas"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
            <div>
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: 96, height: 96, borderRadius: '1rem', objectFit: 'cover', border: '1px solid var(--border)' }}
                />
              ) : (
                <PlaceholderImagen size={96} />
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Imagen (opcional)</label>
              <input className="input" type="file" accept="image/*" onChange={handleFile} />
              <p style={{ color: 'var(--muted)', marginTop: '0.35rem' }}>Se almacenará la ruta en el backend.</p>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Precio actual</label>
              <input className="input" value={form.precio_actual ?? 0} disabled />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '0.35rem' }}>Stock actual</label>
              <input className="input" value={form.stock_actual ?? 0} disabled />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              <input type="checkbox" name="estado" checked={!!form.estado} onChange={handleChange} />
              <span>Producto activo</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Guardar cambios' : 'Guardar producto'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
