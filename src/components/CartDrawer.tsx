import { Minus, Plus, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney, type CartItem } from '../data'
import { useStore } from '../context/StoreContext'

type Props = {
  open: boolean
  items: CartItem[]
  onClose: () => void
  onQty: (id: string, qty: number, selectedSize?: string) => void
  onRemove: (id: string, selectedSize?: string) => void
}

export function CartDrawer({ open, items, onClose, onQty, onRemove }: Props) {
  const { isLoggedIn } = useStore()
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl safe-pb">
        <div className="flex items-center justify-between border-b border-bb-border px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 className="text-lg font-bold text-bb-text">Cart ({count})</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-bb-gray"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-semibold text-bb-text">Your cart is empty</p>
              <p className="mt-1 text-sm text-bb-muted">
                Save pieces from the shop to continue.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 bg-bb-blue px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase"
              >
                Keep browsing
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.selectedSize ?? ''}`}
                  className="flex gap-3"
                >
                  <Link to={`/product/${item.id}`} onClick={onClose}>
                    <img
                      src={item.image}
                      alt=""
                      className="size-20 rounded-lg object-cover bg-bb-gray"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-semibold text-bb-text hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.selectedSize && (
                      <p className="mt-0.5 text-xs text-bb-muted">
                        Size {item.selectedSize}
                      </p>
                    )}
                    <p className="mt-1 font-bold">{formatMoney(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center border border-bb-border">
                        <button
                          type="button"
                          className="grid size-8 place-items-center"
                          onClick={() =>
                            onQty(
                              item.id,
                              Math.max(1, item.qty - 1),
                              item.selectedSize,
                            )
                          }
                          aria-label="Decrease"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="grid size-8 place-items-center"
                          onClick={() =>
                            onQty(
                              item.id,
                              Math.min(8, item.qty + 1),
                              item.selectedSize,
                            )
                          }
                          aria-label="Increase"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id, item.selectedSize)}
                        className="rounded-lg p-2 text-bb-save hover:bg-bb-gray"
                        aria-label="Remove"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-bb-border px-5 py-4">
            <div className="mb-3 flex justify-between text-base font-bold">
              <span>Subtotal</span>
              <span>{formatMoney(total)}</span>
            </div>
            <Link
              to={isLoggedIn ? '/checkout' : '/account?next=/checkout'}
              onClick={onClose}
              className="flex w-full items-center justify-center bg-bb-blue py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-bb-blue-dark"
            >
              {isLoggedIn ? 'Checkout' : 'Sign in to checkout'}
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="mt-2 flex w-full items-center justify-center py-2 text-xs tracking-wide text-bb-muted uppercase hover:text-bb-text"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
