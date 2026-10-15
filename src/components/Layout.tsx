import { Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { LocationModal } from './LocationModal'
import { NewsletterPopup } from './NewsletterPopup'

export function Layout() {
  const { pathname } = useLocation()
  const { cart, cartOpen, closeCart, setQty, removeFromCart, toast } =
    useStore()
  // announcement (~32px) + header bar (~56–60px)
  const needsHeaderOffset = pathname !== '/'

  return (
    <div id="top" className="min-h-svh bg-white">
      <Header />
      <div
        className={
          needsHeaderOffset ? 'pt-[5.5rem] sm:pt-[5.75rem]' : undefined
        }
      >
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
        <div className="fixed bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 truncate bg-[#6b161d] px-5 py-2.5 text-sm font-medium tracking-wide text-white shadow-lg lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
          {toast}
        </div>
      )}
    </div>
  )
}
