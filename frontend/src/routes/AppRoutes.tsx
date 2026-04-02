import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ProductsPage } from '../pages/ProductsPage'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { OrdersPage } from '../pages/OrdersPage'
import { VendorProductFormPage } from '../pages/vendor/VendorProductFormPage'
import { VendorOrdersPage } from '../pages/vendor/VendorOrdersPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/products/new"
          element={
            <ProtectedRoute roles={['vendor']}>
              <VendorProductFormPage mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/products/:id/edit"
          element={
            <ProtectedRoute roles={['vendor']}>
              <VendorProductFormPage mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/orders"
          element={
            <ProtectedRoute roles={['vendor']}>
              <VendorOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
