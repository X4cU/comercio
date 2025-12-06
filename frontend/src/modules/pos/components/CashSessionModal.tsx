import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  hasSession: boolean;
  onOpenSession: (payload: { cash_register_id: number; opening_amount: number; notes?: string }) => Promise<void>;
  onCloseSession: (payload: { cash_session_id: number; closing_amount: number; notes?: string }) => Promise<void>;
  sessionId?: number;
}

export default function CashSessionModal({ isOpen, hasSession, onOpenSession, onCloseSession, sessionId }: Props) {
  const [cashRegisterId, setCashRegisterId] = useState(1);
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!hasSession) {
      await onOpenSession({ cash_register_id: cashRegisterId, opening_amount: amount, notes });
    } else if (sessionId) {
      await onCloseSession({ cash_session_id: sessionId, closing_amount: amount, notes });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{hasSession ? 'Cerrar caja' : 'Abrir caja'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!hasSession && (
            <div>
              <label className="text-sm block mb-1">Caja</label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                value={cashRegisterId}
                onChange={(e) => setCashRegisterId(Number(e.target.value))}
              />
            </div>
          )}
          <div>
            <label className="text-sm block mb-1">{hasSession ? 'Monto de cierre' : 'Monto de apertura'}</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Notas</label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-white py-2 rounded font-semibold">
            {hasSession ? 'Cerrar caja' : 'Abrir caja'}
          </button>
        </form>
        {hasSession && <p className="text-xs text-slate-400 mt-2">Se calculará el resumen al cerrar.</p>}
      </div>
    </div>
  );
}
