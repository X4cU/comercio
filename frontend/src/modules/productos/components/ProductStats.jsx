import React from 'react';
import { BanknotesIcon, CubeIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const icons = {
  total: BanknotesIcon,
  activos: ShieldCheckIcon,
  stock: CubeIcon
};

export function ProductStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((item) => {
        const Icon = icons[item.id];
        return (
          <div key={item.id} className="card flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.accent}`}> 
              {Icon && <Icon className="h-6 w-6 text-white" aria-hidden="true" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{item.value}</p>
              {item.sub && <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
