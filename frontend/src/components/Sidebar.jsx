import React from 'react';
import { NavLink } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import {
  CubeIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TagIcon,
  BellAlertIcon,
  MegaphoneIcon,
  ArrowDownOnSquareStackIcon,
  ShoppingCartIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const sections = [
  {
    title: 'General',
    items: [
      { to: '/', label: 'Inicio', icon: HomeIcon }
    ]
  },
  {
    title: 'Inventario',
    items: [
      { to: '/categorias', label: 'Categorías', icon: TagIcon },
      {
        to: '/productos',
        label: 'Productos',
        icon: CubeIcon,
        children: [
          { to: '/productos', label: 'Listado' },
          { to: '/productos/nuevo', label: 'Nuevo producto' }
        ]
      }
    ]
  },
  {
    title: 'Operaciones',
    items: [
      {
        to: '/stock',
        label: 'Gestión de stock',
        icon: BellAlertIcon,
        children: [
          { to: '/stock', label: 'Dashboard' },
          { to: '/stock/movimientos/nuevo', label: 'Nuevo movimiento' },
          { to: '/stock/historial', label: 'Historial de movimientos' }
        ]
      },
      {
        to: '/ingresos',
        label: 'Ingresos de mercadería',
        icon: ArrowDownOnSquareStackIcon,
        children: [
          { to: '/ingresos/nuevo', label: 'Nuevo ingreso' },
          { to: '/ingresos/historial', label: 'Historial de ingresos' }
        ]
      }
    ]
  },
  {
    title: 'Ventas',
    items: [
      { to: '/preventas/simulador', label: 'Simulador de venta', icon: ShoppingCartIcon },
      { to: '/preventas/guardadas', label: 'Preventas guardadas', icon: ClipboardDocumentCheckIcon }
    ]
  },
  {
    title: 'Comercial',
    items: [
      { to: '/ofertas/sugeridas', label: 'Ofertas sugeridas', icon: MegaphoneIcon },
      { to: '/ofertas/historial', label: 'Historial de ofertas', icon: ClipboardDocumentListIcon },
      { to: '/promociones', label: 'Promociones', icon: TagIcon }
    ]
  },
  {
    title: 'Finanzas',
    items: [
      { to: '/finanzas/costos-fijos', label: 'Costos fijos', icon: BanknotesIcon },
      { to: '/caja/cierre-diario', label: 'Cierre diario de caja', icon: ClipboardDocumentCheckIcon }
    ]
  },
  {
    title: 'Analítica',
    items: [
      { to: '/reportes', label: 'Reportes', icon: ChartBarIcon },
      { to: '/configuracion', label: 'Configuración', icon: Cog6ToothIcon }
    ]
  }
];

export function Sidebar({ visible, onNavigate = () => {} }) {
  return (
    <aside
      className={`${
        visible ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-72 border-r border-gray-100 bg-white/90 p-4 shadow-lg backdrop-blur transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 md:static md:translate-x-0`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Comercio</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">Panel principal</p>
        </div>
      </div>
      <div className="space-y-2">
        {sections.map((section) => (
          <Disclosure key={section.title} defaultOpen>
            {({ open }) => (
              <div className="rounded-xl border border-gray-100 bg-white/70 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
                <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:text-emerald-600 dark:text-gray-200">
                  {section.title}
                  <ChevronDownIcon
                    className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform scale-y-95 opacity-0"
                  enterTo="transform scale-y-100 opacity-100"
                  leave="transition duration-100 ease-in"
                  leaveFrom="transform scale-y-100 opacity-100"
                  leaveTo="transform scale-y-95 opacity-0"
                >
                  <Disclosure.Panel className="flex flex-col gap-1 px-2 pb-3">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                      if (hasChildren) {
                        return (
                          <div key={item.to} className="flex flex-col gap-1">
                            <NavLink
                              to={item.to}
                              className={({ isActive }) =>
                                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-gray-800 ${
                                  isActive
                                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-gray-800 dark:text-emerald-200'
                                    : 'text-gray-700 dark:text-gray-200'
                                }`
                              }
                              onClick={onNavigate}
                            >
                              <Icon className="h-5 w-5" />
                              {item.label}
                            </NavLink>
                            <div className="ml-10 flex flex-col gap-1 border-l border-gray-100 pl-3 dark:border-gray-800">
                              {item.children.map((child) => (
                                <NavLink
                                  key={child.to}
                                  to={child.to}
                                  className={({ isActive }) =>
                                    `rounded-lg px-3 py-1 text-xs font-semibold transition hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-gray-800 ${
                                      isActive
                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-gray-800 dark:text-emerald-200'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`
                                  }
                                  onClick={onNavigate}
                                >
                                  {child.label}
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-gray-800 ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-gray-800 dark:text-emerald-200'
                                : 'text-gray-700 dark:text-gray-200'
                            }`
                          }
                          onClick={onNavigate}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </aside>
  );
}
