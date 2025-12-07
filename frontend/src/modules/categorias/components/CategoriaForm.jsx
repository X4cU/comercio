import IconPicker from '@/components/IconPicker';
import { useEffect, useMemo, useState } from 'react';

const inputClasses =
  'w-full border rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700';
const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-200';

export function CategoriaForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ nombre: '', icono: null });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ nombre: initialData?.nombre || '', icono: initialData?.icono || null });
  }, [initialData]);

  const isValid = useMemo(() => form.nombre.trim().length > 0, [form.nombre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit?.({ nombre: form.nombre.trim(), icono: form.icono?.trim() || '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className={labelClasses} htmlFor="nombre">
          Nombre de categoría <span className="text-indigo-600">*</span>
        </label>
        <input
          id="nombre"
          value={form.nombre}
          onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
          placeholder="Ej: Bebidas"
          className={inputClasses}
        />
        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
      </div>

      <div className="space-y-2">
        <label className={labelClasses} htmlFor="icono">
          Icono (nombre lucide-react, opcional)
        </label>
        <IconPicker value={form.icono} onChange={(value) => setForm((prev) => ({ ...prev, icono: value }))} />
        <p className="text-xs text-gray-500 dark:text-gray-400">Puedes dejarlo vacío si no deseas icono.</p>
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
