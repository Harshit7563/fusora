import { Outlet } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { LocationModal } from './LocationModal'
import { NewsletterPopup } from './NewsletterPopup'

export function Layout() {
  const { cart, cartOpen, closeCart, setQty, removeFromCart, toast } =
    useStore()

  return (
    <div id="top" className="min-h-svh bg-white">
      <Header />
      {/* promo + logo row + category nav */}
      <div className="pt-[6.75rem] sm:pt-[7.25rem] lg:pt-[9.75rem]">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={closeCart}
        onQty={setQty}
        onRemove={removeFromCart}
      />
      <LocationModal />
      <NewsletterPopup />
      {toast && (
        <div className="fixed bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 truncate rounded-full bg-[#6d1f2c] px-5 py-2.5 text-sm font-medium tracking-wide text-white shadow-lg lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
          {toast}
        </div>
      )}
    </div>
  )
}
