import React from 'react';

interface Props {
  search: string;
  flag: string;
  onSearch: (value: string) => void;
  onFlagChange: (value: string) => void;
}

export const SuggestionFilters: React.FC<Props> = ({ search, flag, onSearch, onFlagChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar producto"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-1/2"
      />
      <select
        value={flag}
        onChange={(e) => onFlagChange(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-1/4"
      >
        <option value="">Todas las razones</option>
        <option value="LOW_STOCK">Stock bajo</option>
        <option value="BELOW_MIN">Debajo del mínimo</option>
        <option value="HIGH_ROTATION">Alta rotación</option>
        <option value="RECENT_LIQUIDATIONS">Liquidaciones recientes</option>
      </select>
    </div>
  );
};
