import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { productosService } from '../services/productosService';

const defaultData = {
  nombre: '',
  descripcion: '',
  categoria: '',
  unidad_medida: '',
  precio: '',
  margen: '',
  stock_actual: '',
  stock_optimo: '',
  vida_util_dias: '',
  imagenes: [],
  estado: true
};

const categorias = ['Frutas', 'Lácteos', 'Bebidas', 'Limpieza', 'Abarrotes'];
const unidades = ['kg', 'unidad', 'paquete', 'litro', 'caja'];

export function ProductForm({ initialData = {}, onSubmit, mode = 'create' }) {
  const navigate = useNavigate();
  const [data, setData] = useState({ ...defaultData, ...initialData });
  const [previews, setPreviews] = useState(initialData.imagenes || []);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setData({ ...defaultData, ...initialData });
    setPreviews(initialData.imagenes || []);
  }, [initialData]);

  const validator = useMemo(
    () => ({
      nombre: (value) => (!value ? 'El nombre es obligatorio' : ''),
      descripcion: (value) => (!value ? 'La descripción es obligatoria' : ''),
      categoria: (value) => (!value ? 'Seleccioná una categoría' : ''),
      unidad_medida: (value) => (!value ? 'Seleccioná una unidad' : ''),
      precio: (value) => (value === '' || Number(value) <= 0 ? 'Ingresá un precio válido' : ''),
      margen: (value) => (value === '' || Number(value) < 0 ? 'Ingresá un margen válido' : ''),
      stock_actual: (value) => (value === '' || Number(value) < 0 ? 'Stock no puede ser negativo' : ''),
      stock_optimo: (value) => (value === '' || Number(value) <= 0 ? 'Definí un stock óptimo' : ''),
      vida_util_dias: (value) => (value === '' || Number(value) <= 0 ? 'Indica la vida útil en días' : '')
    }),
    []
  );

  const onDrop = (acceptedFiles) => {
    const newPreviews = acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setPreviews((prev) => [...prev, ...newPreviews.map((f) => f.preview)]);
    setData((prev) => ({ ...prev, imagenes: [...(prev.imagenes || []), ...newPreviews] }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = Object.entries(validator).reduce((acc, [field, fn]) => {
      const message = fn(data[field]);
      if (message) acc[field] = message;
      return acc;
    }, {});
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const imagenesSubidas = await productosService.uploadImagenes(data.imagenes || []);
    const payload = {
      ...data,
      precio: Number(data.precio),
      margen: Number(data.margen),
      stock_actual: Number(data.stock_actual),
      stock_optimo: Number(data.stock_optimo),
      vida_util_dias: Number(data.vida_util_dias),
      imagenes: imagenesSubidas.map((img, idx) => img || previews[idx])
    };
    onSubmit(payload);
    setSubmitting(false);
  };

  const removeImage = (url) => {
    setPreviews((prev) => prev.filter((img) => img !== url));
    setData((prev) => ({ ...prev, imagenes: (prev.imagenes || []).filter((img) => img.preview !== url && img !== url) }));
  };

  return (
    <form className="card flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{mode === 'create' ? 'Nuevo producto' : 'Editar producto'}</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{data.nombre || 'Producto sin nombre'}</h1>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span>Nombre</span>
          <input
            value={data.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            required
          />
          {errors.nombre && <span className="input-error">{errors.nombre}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Categoría</span>
          <select
            value={data.categoria}
            onChange={(e) => handleChange('categoria', e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && <span className="input-error">{errors.categoria}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span>Descripción</span>
        <textarea
          rows="3"
          value={data.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          required
        />
        {errors.descripcion && <span className="input-error">{errors.descripcion}</span>}
      </label>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>Unidad de medida</span>
          <select
            value={data.unidad_medida}
            onChange={(e) => handleChange('unidad_medida', e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            {unidades.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unidad_medida && <span className="input-error">{errors.unidad_medida}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Precio</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.precio}
            onChange={(e) => handleChange('precio', e.target.value)}
            required
          />
          {errors.precio && <span className="input-error">{errors.precio}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Margen</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.margen}
            onChange={(e) => handleChange('margen', e.target.value)}
            required
          />
          {errors.margen && <span className="input-error">{errors.margen}</span>}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span>Stock actual</span>
          <input
            type="number"
            min="0"
            value={data.stock_actual}
            onChange={(e) => handleChange('stock_actual', e.target.value)}
            required
          />
          {errors.stock_actual && <span className="input-error">{errors.stock_actual}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Stock óptimo</span>
          <input
            type="number"
            min="0"
            value={data.stock_optimo}
            onChange={(e) => handleChange('stock_optimo', e.target.value)}
            required
          />
          {errors.stock_optimo && <span className="input-error">{errors.stock_optimo}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span>Vida útil (días)</span>
          <input
            type="number"
            min="1"
            value={data.vida_util_dias}
            onChange={(e) => handleChange('vida_util_dias', e.target.value)}
            required
          />
          {errors.vida_util_dias && <span className="input-error">{errors.vida_util_dias}</span>}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Imágenes</span>
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
              isDragActive ? 'border-emerald-500 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-900/40' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'
            }`}
          >
            <input {...getInputProps()} />
            <PhotoIcon className="h-10 w-10 text-emerald-500" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Arrastrá y soltá las imágenes</p>
              <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
            </div>
            <span className="text-xs text-gray-500">o haz click para seleccionar</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {previews.map((img) => (
            <div key={img} className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
              <img src={img} alt="Preview" className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow-sm hover:bg-white"
              >
                Quitar
              </button>
            </div>
          ))}
          {previews.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Aún no cargaste imágenes.</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <label className="flex items-center gap-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <input
            type="checkbox"
            checked={data.estado}
            onChange={(e) => handleChange('estado', e.target.checked)}
            className="h-4 w-4"
          />
          Producto activo
        </label>
        <p className="text-xs text-gray-500">Si está desactivado, no aparecerá en búsquedas ni ventas.</p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar producto'}
        </button>
      </div>
    </form>
  );
}
