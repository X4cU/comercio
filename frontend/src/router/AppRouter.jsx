import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import ListadoProductos from '../modules/productos/pages/ListadoProductos';
import NuevoProducto from '../modules/productos/pages/NuevoProducto';
import EditarProducto from '../modules/productos/pages/EditarProducto';
import DetalleProducto from '../modules/productos/pages/DetalleProducto';
import CategoriasPage from '../modules/categorias/pages/CategoriasPage';
import ResumenStock from '../modules/stock/pages/ResumenStock';
import AlertasStock from '../modules/stock/pages/AlertasStock';
import OfertasSugeridas from '../modules/ofertas/pages/OfertasSugeridas';
import NuevaOferta from '../modules/ofertas/pages/NuevaOferta';
import HistorialOfertas from '../modules/ofertas/pages/HistorialOfertas';
import NuevoIngreso from '../modules/ingresos/pages/NuevoIngreso';
import HistorialIngresos from '../modules/ingresos/pages/HistorialIngresos';

function Placeholder({ title }) {
  return (
    <div className="card">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Contenido en construcción.</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Placeholder title="Inicio" />} />
        <Route path="/productos" element={<ListadoProductos />} />
        <Route path="/productos/nuevo" element={<NuevoProducto />} />
        <Route path="/productos/:id/editar" element={<EditarProducto />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/stock" element={<ResumenStock />} />
        <Route path="/stock/alertas" element={<AlertasStock />} />
        <Route path="/ingresos" element={<NuevoIngreso />} />
        <Route path="/ingresos/nuevo" element={<NuevoIngreso />} />
        <Route path="/ingresos/historial" element={<HistorialIngresos />} />
        <Route path="/ofertas" element={<Navigate to="/ofertas/sugeridas" replace />} />
        <Route path="/ofertas/sugeridas" element={<OfertasSugeridas />} />
        <Route path="/ofertas/nueva" element={<NuevaOferta />} />
        <Route path="/ofertas/historial" element={<HistorialOfertas />} />
        <Route path="/reportes" element={<Placeholder title="Reportes" />} />
        <Route path="/configuracion" element={<Placeholder title="Configuración" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
