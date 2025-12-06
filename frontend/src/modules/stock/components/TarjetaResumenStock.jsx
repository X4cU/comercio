import React from 'react';
import { CheckBadgeIcon, ShoppingBagIcon, MegaphoneIcon, FireIcon } from '@heroicons/react/24/solid';

const iconMap = {
  ok: CheckBadgeIcon,
  reposicion: ShoppingBagIcon,
  oferta: MegaphoneIcon,
  liquidacion: FireIcon
};

const toneMap = {
  ok: 'bg-emerald-500',
  reposicion: 'bg-amber-400',
  oferta: 'bg-orange-500',
  liquidacion: 'bg-rose-500'
};

export function TarjetaResumenStock({ id, titulo, valor, detalle }) {
  const Icon = iconMap[id] || ShoppingBagIcon;
  const tone = toneMap[id] || 'bg-gray-300';

  return (
    <div className="card flex items-center gap-3">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-6 w-6 text-white" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{titulo}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{valor}</p>
        {detalle && <p className="text-xs text-gray-500 dark:text-gray-400">{detalle}</p>}
      </div>
    </div>
  );
}
