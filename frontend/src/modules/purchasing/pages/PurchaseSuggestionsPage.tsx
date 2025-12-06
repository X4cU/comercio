import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SuggestionHeader } from '../components/SuggestionHeader';
import { SuggestionFilters } from '../components/SuggestionFilters';
import { SuggestionItemsTable } from '../components/SuggestionItemsTable';
import { purchasingApi, PurchaseSuggestion, PurchaseSuggestionItem } from '../api/purchasingApi';
import { AuthContext } from '../../../context/AuthContext';

const PurchaseSuggestionsPage: React.FC = () => {
  const { roles = [] } = useContext(AuthContext);
  const [current, setCurrent] = useState<PurchaseSuggestion | null>(null);
  const [items, setItems] = useState<PurchaseSuggestionItem[]>([]);
  const [search, setSearch] = useState('');
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(false);

  const canEdit = useMemo(
    () => roles.includes('admin') || roles.includes('superadmin'),
    [roles]
  );

  const loadLatest = async () => {
    setLoading(true);
    try {
      const data = await purchasingApi.listSuggestions();
      const first = data.data?.[0] ?? null;
      if (first) {
        const detail = await purchasingApi.getSuggestion(first.id);
        setCurrent(detail);
        setItems(detail.items || []);
      } else {
        setCurrent(null);
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatest();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const suggestion = await purchasingApi.generateSuggestion({});
      setCurrent(suggestion);
      setItems(suggestion.items || []);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (itemId: number, payload: { final_qty: number; notes?: string }) => {
    if (!current) return;
    const updated = await purchasingApi.updateItem(current.id, itemId, payload);
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updated } : item)));
  };

  const handleConfirm = async () => {
    if (!current) return;
    const updated = await purchasingApi.confirmSuggestion(current.id);
    setCurrent({ ...current, ...updated });
  };

  const handleCancel = async () => {
    if (!current) return;
    const updated = await purchasingApi.cancelSuggestion(current.id);
    setCurrent({ ...current, ...updated });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.product?.nombre
      ? item.product.nombre.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesFlag = flag ? item.reason_flags?.includes(flag) : true;
    return matchesSearch && matchesFlag;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Compras sugeridas</h1>
        {loading && <span className="text-sm text-gray-500">Cargando...</span>}
      </div>

      <SuggestionHeader
        suggestion={current}
        canEdit={canEdit}
        onGenerate={handleGenerate}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <SuggestionFilters
        search={search}
        flag={flag}
        onSearch={setSearch}
        onFlagChange={setFlag}
      />

      {current ? (
        <SuggestionItemsTable items={filteredItems} canEdit={canEdit && current.status === 'DRAFT'} onUpdate={handleUpdateItem} />
      ) : (
        <div className="border border-dashed rounded p-6 text-center text-gray-600">
          No hay sugerencias generadas para hoy.
          {canEdit && (
            <button className="ml-3 px-3 py-2 bg-indigo-600 text-white rounded" onClick={handleGenerate}>
              Generar sugerencias de compra
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseSuggestionsPage;
