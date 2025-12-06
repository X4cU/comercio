import React, { useEffect, useMemo, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ingresosService } from '../services/ingresosService';

export function SelectorProducto({ value, onSelect }) {
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    ingresosService.fetchProductos().then(setProductos);
  }, []);

  const productosFiltrados = useMemo(() => {
    if (!query) return productos;
    const lowered = query.toLowerCase();
    return productos.filter(
      (prod) => prod.nombre.toLowerCase().includes(lowered) || prod.categoria.toLowerCase().includes(lowered)
    );
  }, [productos, query]);

  const selected = useMemo(() => productos.find((p) => p.id === value?.id) || value, [productos, value]);

  return (
    <div className="space-y-3">
      <Combobox value={selected} onChange={onSelect}>
        <Combobox.Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Producto
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
            mock
          </span>
        </Combobox.Label>
        <div className="relative">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden />
            <Combobox.Input
              className="w-full rounded-xl border border-gray-200 bg-white px-9 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              displayValue={(prod) => prod?.nombre || ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o categoría"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
            {productosFiltrados.length === 0 && (
              <div className="cursor-default select-none px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No hay coincidencias
              </div>
            )}
            {productosFiltrados.map((producto) => (
              <Combobox.Option
                key={producto.id}
                value={producto}
                className={({ active }) =>
                  `flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm ${
                    active ? 'bg-emerald-50 text-emerald-700 dark:bg-gray-800 dark:text-emerald-200' : ''
                  }`
                }
              >
                <div>
                  <p className="font-semibold">{producto.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {producto.categoria} • {producto.tipo_seccion}
                  </p>
                </div>
                <CheckIcon className="h-4 w-4 text-emerald-500" />
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      {selected ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Ficha seleccionada</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{selected.nombre}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{selected.categoria}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">Tipo sección: {selected.tipo_seccion}</p>
              {selected.tipo_seccion === 'VERDULERIA' && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Duración estimada: {selected.duracion_estimada_dias} días
                </p>
              )}
            </div>
            {selected.imagen_url && (
              <img
                src={selected.imagen_url}
                alt={selected.nombre}
                className="h-14 w-14 rounded-lg object-cover shadow-inner"
              />
            )}
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800 dark:text-emerald-200"
            onClick={() => onSelect(null)}
          >
            Limpiar selección
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400">Seleccioná un producto para precargar sección y vencimientos.</p>
      )}
    </div>
  );
}
