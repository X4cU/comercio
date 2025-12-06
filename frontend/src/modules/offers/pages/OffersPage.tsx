import React, { useEffect, useMemo, useState } from 'react';
import { offersApi } from '../api/offersApi';
import OfferSuggestionsTable from '../components/OfferSuggestionsTable';
import ActiveOffersTable from '../components/ActiveOffersTable';
import OfferFormDrawer from '../components/OfferFormDrawer';
import OfferStatsSummary from '../components/OfferStatsSummary';
import { useLocation } from 'react-router-dom';

export const OffersPage: React.FC = () => {
  const [tab, setTab] = useState<'suggestions' | 'active'>('suggestions');
  const [suggestions, setSuggestions] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const location = useLocation();

  const readOnlyMode = useMemo(() => location.pathname.includes('/sugeridas') && !location.pathname.includes('/stock/ofertas'), [
    location.pathname
  ]);

  useEffect(() => {
    loadSuggestions();
    loadActive();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await offersApi.getSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error('Error al cargar sugerencias', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActive = async () => {
    try {
      const data = await offersApi.getActiveOffers();
      setActiveOffers(data);
    } catch (error) {
      console.error('Error al cargar ofertas activas', error);
    }
  };

  const handleCreateFromSuggestion = (suggestion: any) => {
    setSelectedProduct(suggestion);
    setEditingOffer(null);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      product_id: editingOffer?.product_id || selectedProduct?.product_id || values.product_id,
      old_price: values.old_price ?? selectedProduct?.current_price,
    };

    if (editingOffer) {
      await offersApi.updateOffer(editingOffer.id, payload);
    } else {
      await offersApi.createOffer(payload);
    }

    await Promise.all([loadActive(), loadSuggestions()]);
    setEditingOffer(null);
    setSelectedProduct(null);
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setSelectedProduct({
      product_id: offer.product_id,
      name: offer.product?.nombre,
      current_price: offer.old_price,
      suggested_type: offer.type,
      stock_current: offer.affected_quantity,
    });
    setDrawerOpen(true);
  };

  const handleCancel = async (offer: any) => {
    await offersApi.cancelOffer(offer.id);
    loadActive();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ofertas y liquidaciones</h1>
          <p className="text-sm text-gray-600">Módulo orientado a perecederos, listo para integrarse con POS y reportes.</p>
        </div>
        <div className="flex space-x-2 bg-gray-100 rounded-md p-1">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${tab === 'suggestions' ? 'bg-white shadow' : ''}`}
            onClick={() => setTab('suggestions')}
          >
            Sugeridas
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${tab === 'active' ? 'bg-white shadow' : ''}`}
            onClick={() => setTab('active')}
          >
            Activas
          </button>
        </div>
      </div>

      {tab === 'suggestions' && (
        <OfferSuggestionsTable
          suggestions={suggestions}
          loading={loading}
          onCreate={handleCreateFromSuggestion}
          disableActions={readOnlyMode}
        />
      )}

      {tab === 'active' && (
        <ActiveOffersTable
          offers={activeOffers}
          loading={loading}
          onEdit={handleEdit}
          onCancel={handleCancel}
          disableActions={readOnlyMode}
        />
      )}

      <OfferStatsSummary />

      <OfferFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        productName={selectedProduct?.name}
        initialValues={editingOffer || { product_id: selectedProduct?.product_id, type: selectedProduct?.suggested_type }}
        currentPrice={selectedProduct?.current_price}
        maxQuantity={selectedProduct?.stock_current}
        readOnly={readOnlyMode}
      />
    </div>
  );
};

export default OffersPage;
