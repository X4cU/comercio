import React, { useRef, useState } from 'react';

const MAX_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export function ImageUploader({ value, onChange, label = 'Foto del producto', error }) {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError('Solo se permiten imágenes JPG o PNG');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLocalError('La imagen no puede superar los 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalError('');
      onChange?.(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onSelect = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <div
        className={`flex items-center gap-4 rounded-lg border-2 border-dashed px-4 py-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 dark:border-gray-700 ${
          error || localError ? 'border-red-500 bg-red-50/40 dark:border-red-500 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div className="aspect-square w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          {value ? (
            <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">1:1</div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Arrastra y suelta una imagen o{' '}
            <span className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700">búscala en tu dispositivo</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Formatos permitidos: JPG, PNG. Máximo 3MB.</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={onSelect}
          />
        </div>
      </div>
      {(error || localError) && (
        <p className="text-sm text-red-600 dark:text-red-400">{error || localError}</p>
      )}
    </div>
  );
}
