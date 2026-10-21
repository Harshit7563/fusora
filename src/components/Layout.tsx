import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useCatalog } from '../hooks/useCatalog'
import { useStore } from '../context/StoreContext'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { LocationModal } from './LocationModal'
import { NewsletterPopup } from './NewsletterPopup'
import { ScamAlert } from './ScamAlert'

export function Layout() {
  const {
    cart,
    cartOpen,
    closeCart,
    setQty,
    removeFromCart,
    toast,
    wishToast,
    dismissWishToast,
  } = useStore()
  const { products } = useCatalog()
  const wishProduct = wishToast
    ? products.find((p) => p.id === wishToast.id)
    : undefined

  return (
    <div id="top" className="min-h-svh bg-[#f8f6ee]">
      <Header />
      {/* offer bar + header + category nav */}
      <div className="pt-[8.7rem] sm:pt-[9.2rem] xl:pt-[7.15rem]">
        <Outlet />
      </div>
      <ScamAlert />
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

      {/* Wishlist popup - right side, auto-dismiss in 3s */}
      <AnimatePresence>
        {wishToast && (
          <motion.div
            key={wishToast.key}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-24 right-3 z-[85] w-[min(92vw,21rem)] overflow-hidden rounded-2xl border border-[#f0e7da] bg-white shadow-[0_16px_44px_rgba(0,0,0,0.16)] sm:right-5"
            role="status"
          >
            <div className="flex items-center gap-3 px-3.5 py-3">
              <span className="relative shrink-0">
                {wishProduct?.image ? (
                  <img
                    src={wishProduct.image}
                    alt=""
                    className="size-12 rounded-xl object-cover"
                  />
                ) : (
                  <span className="grid size-12 place-items-center rounded-xl bg-[#cf2028]/10">
                    <Heart className="size-5 fill-[#cf2028] text-[#cf2028]" />
                  </span>
                )}
                <span className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-[#cf2028] text-white">
                  <Heart className="size-3 fill-white" />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#141414]">
                  {wishToast.added
                    ? 'Added to wishlist'
                    : 'Removed from wishlist'}
                </p>
                {wishProduct && (
                  <p className="line-clamp-1 text-xs text-[#6a6667]">
                    {wishProduct.name}
                  </p>
                )}
                {wishToast.added && (
                  <Link
                    to="/wishlist"
                    onClick={dismissWishToast}
                    className="mt-0.5 inline-block text-xs font-bold text-[#cf2028] hover:underline"
                  >
                    View wishlist →
                  </Link>
                )}
              </div>
              <button
                type="button"
                onClick={dismissWishToast}
                aria-label="Close"
                className="grid size-7 shrink-0 place-items-center rounded-full text-[#96938b] transition hover:bg-[#f6f2ec] hover:text-[#141414]"
              >
                <X className="size-4" />
              </button>
            </div>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="h-1 bg-[#cf2028]"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {toast && (
        <div className="fixed bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 truncate bg-[#cf2028] px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-lg lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
          {toast}
        </div>
      )}
    </div>
  )
}
