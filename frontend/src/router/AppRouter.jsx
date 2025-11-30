import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home';
import Productos from '../pages/Productos';
import Stock from '../pages/Stock';
import Ventas from '../pages/Ventas';
import Caja from '../pages/Caja';
import Reportes from '../pages/Reportes';
import Configuracion from '../pages/Configuracion';
import Perfil from '../pages/Perfil';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, roles = [] }) {
  const { loading, hasRole } = useAuth();

  if (loading) return <Loader label="Conectando con Keycloak" />;

  const allowed = roles.length === 0 || hasRole('superadmin') || roles.some((r) => hasRole(r));

  return allowed ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/productos"
          element={
            <ProtectedRoute roles={['repositor']}>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute roles={['repositor']}>
              <Stock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <ProtectedRoute roles={['cajero']}>
              <Ventas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caja"
          element={
            <ProtectedRoute roles={['cajero']}>
              <Caja />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute roles={['admin']}>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute roles={['admin']}>
              <Configuracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
