import { Outlet } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { LocationModal } from './LocationModal'

export function Layout() {
  const { cart, cartOpen, closeCart, setQty, removeFromCart, toast } =
    useStore()

  return (
    <div id="top" className="min-h-svh bg-fusora-ivory">
      <Header />
      <Outlet />
      <Footer />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={closeCart}
        onQty={setQty}
        onRemove={removeFromCart}
      />
      <LocationModal />
      {toast && (
        <div className="fixed bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 truncate bg-bb-blue px-5 py-2.5 text-sm font-medium tracking-wide text-white shadow-lg lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
          {toast}
        </div>
      )}
    </div>
  )
}
