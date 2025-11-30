import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-shell" style={{ padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1rem' }}>
        <Sidebar />
        <div>
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
