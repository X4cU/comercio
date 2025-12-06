import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';

export function Header({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-ghost md:hidden"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Comercio POS</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">Panel de productos</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500" />
          <div className="leading-tight">
            <p>{user?.name || 'Usuario'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Rol no asignado'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
