import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { StoreProvider } from './context/StoreContext'
import { AboutPage } from './pages/AboutPage'
import { AccountPage } from './pages/AccountPage'
import { CartPage } from './pages/CartPage'
import { CategoryPage } from './pages/CategoryPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { PaymentPage } from './pages/PaymentPage'
import { DealsPage } from './pages/DealsPage'
import { HomePage } from './pages/HomePage'
import { MembershipsPage } from './pages/MembershipsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrderDetailPage, OrdersPage } from './pages/OrdersPage'
import { ProductPage } from './pages/ProductPage'
import { StoresPage } from './pages/StoresPage'
import { SupportPage } from './pages/SupportPage'
import { WishlistPage } from './pages/WishlistPage'
import { PoliciesIndexPage, PolicyPage } from './pages/PolicyPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminSellersPage } from './pages/admin/AdminSellersPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { SellerLayout } from './components/SellerLayout'
import { SellPage } from './pages/seller/SellPage'
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage'
import { SellerProductsPage } from './pages/seller/SellerProductsPage'

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <Routes>
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="sellers" element={<AdminSellersPage />} />
            <Route
              path="products/new"
              element={<Navigate to="/admin/products" replace />}
            />
            <Route
              path="products/:id"
              element={<Navigate to="/admin/products" replace />}
            />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>
          <Route path="admin/*" element={<Navigate to="/admin" replace />} />

          <Route path="seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboardPage />} />
            <Route path="products" element={<SellerProductsPage />} />
          </Route>

          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="category/:tab" element={<CategoryPage />} />
            <Route path="category/:tab/:subtype" element={<CategoryPage />} />
            <Route
              path="category/:tab/:subtype/:collection"
              element={<CategoryPage />}
            />
            <Route path="deals" element={<DealsPage />} />
            <Route path="search" element={<DealsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="register" element={<AccountPage />} />
            <Route path="sell" element={<SellPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="policies" element={<PoliciesIndexPage />} />
            <Route path="policies/:slug" element={<PolicyPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="memberships" element={<MembershipsPage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  )
}
