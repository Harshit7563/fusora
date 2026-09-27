import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { StoreProvider } from './context/StoreContext'
import { AboutPage } from './pages/AboutPage'
import { AccountPage } from './pages/AccountPage'
import { CartPage } from './pages/CartPage'
import { CategoryPage } from './pages/CategoryPage'
import { CheckoutPage } from './pages/CheckoutPage'
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

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="category/:tab" element={<CategoryPage />} />
            <Route path="category/:tab/:subtype" element={<CategoryPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="search" element={<DealsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="register" element={<AccountPage />} />
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
