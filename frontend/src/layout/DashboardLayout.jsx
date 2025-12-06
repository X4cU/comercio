import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-6 md:px-6 lg:px-8">
        <Sidebar visible={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            aria-hidden
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 space-y-4">
          <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <main className="pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
