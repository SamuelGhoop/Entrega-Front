import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StoresPage } from './pages/StoresPage';
import { StoreMenuPage } from './pages/StoreMenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { StudentOrdersPage } from './pages/StudentOrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tiendas" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />

        <Route path="tiendas" element={<StoresPage />} />
        <Route path="tiendas/:tiendaId" element={<StoreMenuPage />} />

        <Route
          path="carrito"
          element={
            <ProtectedRoute roles={['Student']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute roles={['Student']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ordenes"
          element={
            <ProtectedRoute roles={['Student']}>
              <StudentOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ordenes/:ordenId"
          element={
            <ProtectedRoute roles={['Student']}>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="vendor"
          element={
            <ProtectedRoute roles={['Vendor']}>
              <VendorDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
