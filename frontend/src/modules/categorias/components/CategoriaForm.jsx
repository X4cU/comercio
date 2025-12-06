import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const colorPalette = [
  '#22c55e',
  '#10b981',
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#f97316',
  '#f59e0b',
  '#ef4444',
  '#14b8a6'
];

export function CategoriaForm({ initialData = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    color: colorPalette[0],
    icono: '',
    estado: true,
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const isValid = useMemo(() => form.nombre.trim().length > 0, [form.nombre]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nombre.trim()) {
      nextErrors.nombre = 'El nombre es requerido';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            value={form.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Bebidas energéticas"
            required
          />
          {errors.nombre && <p className="input-error">{errors.nombre}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="icono">Icono (emoji o texto)</label>
          <input
            id="icono"
            value={form.icono || ''}
            onChange={(e) => handleChange('icono', e.target.value)}
            placeholder="Ej: 🧃"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          rows={3}
          value={form.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          placeholder="Detalle de los productos que agrupa la categoría"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label>Color</label>
          <div className="flex flex-wrap gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange('color', color)}
                className={`h-10 w-10 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  form.color === color ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Seleccionar color ${color}`}
              />
            ))}
            <input
              type="color"
              value={form.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="h-10 w-20 cursor-pointer rounded-lg border border-gray-200 bg-white px-2 dark:border-gray-800 dark:bg-gray-900"
              aria-label="Selector personalizado de color"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            value={form.estado ? 'activo' : 'inactivo'}
            onChange={(e) => handleChange('estado', e.target.value === 'activo')}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100">
        <p className="font-semibold">Vista previa rápida</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: form.color }}>
            {form.icono || '🏷️'}
          </span>
          <div>
            <p className="font-semibold" style={{ color: form.color }}>
              {form.nombre || 'Nombre de categoría'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">{form.descripcion || 'Descripción visible aquí'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="btn-primary" disabled={!isValid || submitting}>
          {submitting ? 'Guardando...' : 'Guardar categoría'}
        </button>
        <Link to="/categorias" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
