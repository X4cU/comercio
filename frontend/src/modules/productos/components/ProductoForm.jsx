import React, { useEffect, useMemo, useState } from 'react';
import { ImageUploader } from './ImageUploader';

const unidadesMedida = ['unidad', 'kg', 'litro', 'paquete', 'caja', 'bolsa'];

const baseClasses =
  'w-full border rounded-md px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

export function ProductoForm({ initialData = {}, categorias = [], onSubmit, submitting = false }) {
  const [formData, setFormData] = useState({
    imagen: initialData.imagen || '',
    nombre: initialData.nombre || '',
    categoriaId: initialData.categoriaId || '',
    subcategoriaId: initialData.subcategoriaId || '',
    precioBase: initialData.precioBase ?? '',
    precioFinal: initialData.precioFinal ?? '',
    stock: initialData.stock ?? '',
    unidad: initialData.unidad || 'unidad',
    descripcion: initialData.descripcion || ''
  });

  const [errors, setErrors] = useState({});

  const subcategoriasDisponibles = useMemo(() => {
    const categoria = categorias.find((item) => item.id === formData.categoriaId);
    return categoria?.subcategorias || [];
  }, [categorias, formData.categoriaId]);

  useEffect(() => {
    if (formData.categoriaId && !subcategoriasDisponibles.some((sub) => sub.id === formData.subcategoriaId)) {
      setFormData((prev) => ({ ...prev, subcategoriaId: '' }));
    }
  }, [formData.categoriaId, formData.subcategoriaId, subcategoriasDisponibles]);

  useEffect(() => {
    const base = Number(formData.precioBase);
    if (!Number.isNaN(base) && formData.precioBase !== '' && formData.precioFinal === '') {
      const sugerido = (base * 1.15).toFixed(2);
      setFormData((prev) => ({ ...prev, precioFinal: sugerido }));
    }
  }, [formData.precioBase, formData.precioFinal]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.imagen) newErrors.imagen = 'La foto es obligatoria';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.categoriaId) newErrors.categoriaId = 'Selecciona una categoría';

    const precioBase = Number(formData.precioBase);
    if (formData.precioBase === '' || Number.isNaN(precioBase)) newErrors.precioBase = 'Ingresa un precio base válido';

    if (formData.precioFinal !== '') {
      const precioFinal = Number(formData.precioFinal);
      if (Number.isNaN(precioFinal)) newErrors.precioFinal = 'Ingresa un precio final válido';
    }

    const stock = Number(formData.stock);
    if (formData.stock === '' || Number.isNaN(stock)) newErrors.stock = 'Ingresa el stock inicial';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit?.({ ...formData });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ImageUploader
            value={formData.imagen}
            onChange={(value) => handleChange('imagen', value)}
            error={errors.imagen}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Usa imágenes cuadradas para un encuadre perfecto en todos los dispositivos.
          </p>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
            <input
              type="text"
              className={`${baseClasses} ${errors.nombre ? 'border-red-500' : ''}`}
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Café tostado 500g"
            />
            {errors.nombre && <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Categoría</label>
              <select
                className={`${baseClasses} ${errors.categoriaId ? 'border-red-500' : ''}`}
                value={formData.categoriaId}
                onChange={(e) => handleChange('categoriaId', e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.categoriaId}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subcategoría</label>
              <select
                className={baseClasses}
                value={formData.subcategoriaId}
                onChange={(e) => handleChange('subcategoriaId', e.target.value)}
                disabled={!formData.categoriaId}
              >
                <option value="">Opcional</option>
                {subcategoriasDisponibles.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Precio base</label>
              <input
                type="number"
                step="0.01"
                className={`${baseClasses} ${errors.precioBase ? 'border-red-500' : ''}`}
                value={formData.precioBase}
                onChange={(e) => handleChange('precioBase', e.target.value)}
                placeholder="0.00"
              />
              {errors.precioBase && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.precioBase}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200">
                <span>Precio final</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">Calculado si lo dejas vacío</span>
              </div>
              <input
                type="number"
                step="0.01"
                className={`${baseClasses} ${errors.precioFinal ? 'border-red-500' : ''}`}
                value={formData.precioFinal}
                onChange={(e) => handleChange('precioFinal', e.target.value)}
                placeholder="0.00"
              />
              {errors.precioFinal && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.precioFinal}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Stock inicial</label>
              <input
                type="number"
                step="1"
                className={`${baseClasses} ${errors.stock ? 'border-red-500' : ''}`}
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="0"
              />
              {errors.stock && <p className="text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Unidad de medida</label>
              <select
                className={baseClasses}
                value={formData.unidad}
                onChange={(e) => handleChange('unidad', e.target.value)}
              >
                {unidadesMedida.map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Descripción corta</label>
              <textarea
                rows={3}
                className={`${baseClasses} resize-none`}
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Breve descripción para el catálogo"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                Validación ISO 25010: campos obligatorios claros
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                Dark/Light listos por diseño Tailwind
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Guardar producto'}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">El precio final se calcula si lo dejas en blanco.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
