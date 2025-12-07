import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import ProductosPage from '../modules/productos/pages/ProductosPage';
import ProductoNuevoPage from '../modules/productos/pages/ProductoNuevoPage';
import ProductoEditarPage from '../modules/productos/pages/ProductoEditarPage';
import CategoriasPage from '../modules/categorias/pages/CategoriasPage';
import StockDashboardPage from '../modules/stock/pages/StockDashboardPage';
import MovimientoNuevoPage from '../modules/stock/pages/MovimientoNuevoPage';
import HistorialMovimientosPage from '../modules/stock/pages/HistorialMovimientosPage';
import OffersPage from '../modules/offers/pages/OffersPage';
import OfertasSugeridas from '../modules/ofertas/pages/OfertasSugeridas';
import NuevaOferta from '../modules/ofertas/pages/NuevaOferta';
import HistorialOfertas from '../modules/ofertas/pages/HistorialOfertas';
import NuevoIngreso from '../modules/ingresos/pages/NuevoIngreso';
import HistorialIngresos from '../modules/ingresos/pages/HistorialIngresos';
import NuevaPreventaPage from '../modules/preventa/pages/NuevaPreventaPage';
import ListadoPreventasPage from '../modules/preventa/pages/ListadoPreventasPage';
import SimuladorVentaPage from '../modules/preventa/pages/SimuladorVentaPage';
import PosPage from '../modules/pos/pages/PosPage';
import PurchaseSuggestionsPage from '../modules/purchasing/pages/PurchaseSuggestionsPage';
import NewMerchandisePage from '../modules/inventory/newMerchandise/pages/NewMerchandisePage';
import PromotionsPage from '../modules/promotions/pages/PromotionsPage';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Placeholder({ title }) {
  return (
    <div className="card">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Contenido en construcción.</p>
    </div>
  );
}

function RoleGuard({ roles, children }) {
  const { roles: userRoles = [] } = useContext(AuthContext);

  const allowed = roles.some((role) => userRoles.includes(role) || userRoles.includes('superadmin'));

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Placeholder title="Inicio" />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/productos/nuevo" element={<ProductoNuevoPage />} />
        <Route path="/productos/:id/editar" element={<ProductoEditarPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/stock" element={<StockDashboardPage />} />
        <Route path="/stock/movimientos/nuevo" element={<MovimientoNuevoPage />} />
        <Route path="/stock/historial" element={<HistorialMovimientosPage />} />
        <Route path="/ingresos" element={<NuevoIngreso />} />
        <Route path="/ingresos/nuevo" element={<NuevoIngreso />} />
        <Route path="/ingresos/historial" element={<HistorialIngresos />} />
        <Route
          path="/inventario/nueva-mercaderia"
          element={
            <RoleGuard roles={["repositor", "admin", "superadmin"]}>
              <NewMerchandisePage />
            </RoleGuard>
          }
        />
        <Route path="/preventas" element={<Navigate to="/preventas/guardadas" replace />} />
        <Route path="/preventas/simulador" element={<NuevaPreventaPage />} />
        <Route path="/preventas/guardadas" element={<ListadoPreventasPage />} />
        <Route path="/preventas/guardadas/:id" element={<SimuladorVentaPage />} />
        <Route
          path="/compras/sugeridas"
          element={
            <RoleGuard roles={["repositor", "admin", "superadmin"]}>
              <PurchaseSuggestionsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/stock/ofertas"
          element={
            <RoleGuard roles={["admin", "superadmin"]}>
              <OffersPage />
            </RoleGuard>
          }
        />
        <Route
          path="/stock/ofertas/sugeridas"
          element={
            <RoleGuard roles={["repositor", "admin", "superadmin"]}>
              <OffersPage />
            </RoleGuard>
          }
        />
        <Route path="/ofertas" element={<Navigate to="/ofertas/sugeridas" replace />} />
        <Route path="/ofertas/sugeridas" element={<OfertasSugeridas />} />
        <Route path="/ofertas/nueva" element={<NuevaOferta />} />
        <Route path="/ofertas/historial" element={<HistorialOfertas />} />
        <Route
          path="/promociones"
          element={
            <RoleGuard roles={["repositor", "admin", "superadmin"]}>
              <PromotionsPage />
            </RoleGuard>
          }
        />
        <Route path="/reportes" element={<Placeholder title="Reportes" />} />
        <Route path="/configuracion" element={<Placeholder title="Configuración" />} />
      </Route>
      <Route
        path="/ventas/pos"
        element={
          <RoleGuard roles={["cajero", "admin", "superadmin"]}>
            <PosPage />
          </RoleGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
