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

      {/* Wishlist popup - bottom, Fusora dark theme, auto-dismiss in 3s */}
      <AnimatePresence>
        {wishToast && (
          <motion.div
            key={wishToast.key}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed right-3 bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-[85] sm:left-auto sm:w-[23rem] sm:right-5"
            role="status"
          >
            <div className="relative overflow-hidden rounded-3xl bg-[#141414] shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="relative shrink-0">
                  {wishProduct?.image ? (
                    <img
                      src={wishProduct.image}
                      alt=""
                      className="size-14 rounded-2xl object-cover ring-1 ring-white/15"
                    />
                  ) : (
                    <span className="grid size-14 place-items-center rounded-2xl bg-[#cf2028]/20">
                      <Heart className="size-6 fill-[#cf2028] text-[#cf2028]" />
                    </span>
                  )}
                  <span className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-[#cf2028] ring-2 ring-[#141414]">
                    <Heart className="size-3 fill-white text-white" />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-heading text-lg leading-none tracking-wide text-white uppercase">
                    {wishToast.added ? 'Added to wishlist' : 'Removed'}
                  </p>
                  {wishProduct && (
                    <p className="mt-1 line-clamp-1 text-xs text-white/65">
                      {wishProduct.name}
                    </p>
                  )}
                </div>
                {wishToast.added && (
                  <Link
                    to="/wishlist"
                    onClick={dismissWishToast}
                    className="shrink-0 rounded-full bg-[#cf2028] px-4 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-white hover:text-[#141414]"
                  >
                    View
                  </Link>
                )}
                <button
                  type="button"
                  onClick={dismissWishToast}
                  aria-label="Close"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-[3px] bg-[#ffc462]"
              />
            </div>
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
