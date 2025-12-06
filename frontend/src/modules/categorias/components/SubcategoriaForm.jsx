import { useEffect, useMemo, useState } from 'react';

const inputClasses =
  'w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700';
const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-200';

export function SubcategoriaForm({ categories = [], initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ categoriaId: '', nombre: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      categoriaId: initialData?.categoriaId || categories[0]?.id || '',
      nombre: initialData?.nombre || ''
    });
  }, [categories, initialData]);

  const isValid = useMemo(
    () => form.nombre.trim().length > 0 && Boolean(form.categoriaId),
    [form.nombre, form.categoriaId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.categoriaId) {
      nextErrors.categoriaId = 'Selecciona una categoría';
    }
    if (!form.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit?.({ categoriaId: form.categoriaId, nombre: form.nombre.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className={labelClasses} htmlFor="categoria">
          Categoría
        </label>
        <select
          id="categoria"
          value={form.categoriaId}
          onChange={(e) => setForm((prev) => ({ ...prev, categoriaId: e.target.value }))}
          className={inputClasses}
        >
          {categories.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {errors.categoriaId && <p className="text-sm text-red-500">{errors.categoriaId}</p>}
      </div>

      <div className="space-y-2">
        <label className={labelClasses} htmlFor="nombre">
          Nombre de subcategoría
        </label>
        <input
          id="nombre"
          value={form.nombre}
          onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
          placeholder="Ej: Bebidas energéticas"
          className={inputClasses}
        />
        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          disabled={!isValid}
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
