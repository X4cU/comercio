import { Fragment, useMemo, useState } from 'react';
import { ChevronDownIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export function CategoriaTable({
  categorias = [],
  onEditCategoria,
  onDeleteCategoria,
  onNewSubcategoria,
  onEditSubcategoria,
  onDeleteSubcategoria
}) {
  const [expanded, setExpanded] = useState(() => new Set());

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sortedCategorias = useMemo(
    () => [...categorias].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [categorias]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Categoría
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Cant. Subcategorías
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
          {sortedCategorias.map((categoria) => {
            const isOpen = expanded.has(categoria.id);
            return (
              <Fragment key={categoria.id}>
                <tr key={categoria.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(categoria.id)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                          {categoria.icono || '🏷️'}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{categoria.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{categoria.subcategorias?.length || 0} subcategorías</p>
                        </div>
                      </div>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{categoria.subcategorias?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditCategoria?.(categoria)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <span className="inline-flex items-center gap-2"><PencilIcon className="h-4 w-4" /> Editar</span>
                      </button>
                      <button
                        onClick={() => onDeleteCategoria?.(categoria)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                      >
                        <span className="inline-flex items-center gap-2"><TrashIcon className="h-4 w-4" /> Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {isOpen && (
                  <tr key={`${categoria.id}-details`} className="bg-gray-50/60 dark:bg-gray-950/40">
                    <td colSpan={3} className="px-6 py-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Subcategorías</p>
                          <button
                            onClick={() => onNewSubcategoria?.(categoria)}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                          >
                            <PlusIcon className="h-4 w-4" /> Nueva subcategoría
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {categoria.subcategorias?.map((subcategoria) => (
                            <div
                              key={subcategoria.id}
                              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {subcategoria.nombre}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Dependiente de {categoria.nombre}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    onEditSubcategoria?.({ ...subcategoria, categoriaId: categoria.id })
                                  }
                                  className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                  aria-label="Editar subcategoría"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteSubcategoria?.(categoria, subcategoria)}
                                  className="rounded-md border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                                  aria-label="Eliminar subcategoría"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {categoria.subcategorias?.length === 0 && (
                            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                              Aún no hay subcategorías para esta categoría.
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {sortedCategorias.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No hay categorías registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
