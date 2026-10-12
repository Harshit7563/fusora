import { Link } from 'react-router-dom'
import { formatMoney } from '../data'
import { useStore } from '../context/StoreContext'
import { usePageTitle } from '../hooks/usePageTitle'

export function CartPage() {
  usePageTitle('Cart')
  const { cart, setQty, removeFromCart, openCart, isLoggedIn } = useStore()
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <main className="mx-auto max-w-[900px] px-3 py-8 sm:px-4 lg:px-6">
      <h1 className="font-serif text-3xl text-bb-text sm:text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-bb-muted">
        {cart.length} item{cart.length === 1 ? '' : 's'} in your bag
      </p>

      {cart.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-semibold">Cart is empty</p>
          <Link
            to="/deals"
            className="mt-4 inline-flex rounded-full bg-bb-blue px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            Shop deals
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-xl border border-bb-border bg-white p-4"
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt=""
                    className="size-24 rounded-lg object-cover bg-bb-gray"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${item.id}`}
                    className="font-semibold text-bb-link hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 font-bold">{formatMoney(item.price)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="text-sm">
                      Qty{' '}
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          setQty(item.id, Number(e.target.value))
                        }
                        className="ml-1 rounded border border-bb-border px-2 py-1"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-semibold text-bb-save"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#efe8dc]/70 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5">
            <p className="text-xl font-bold">
              Subtotal: {formatMoney(total)}
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={openCart}
                className="rounded-full border border-bb-border bg-white px-5 py-3 text-center text-xs font-semibold tracking-[0.14em] uppercase sm:py-2.5"
              >
                Quick cart
              </button>
              <Link
                to={isLoggedIn ? '/checkout' : '/account?next=/checkout'}
                className="rounded-full bg-bb-blue px-6 py-3 text-center text-xs font-semibold tracking-[0.14em] text-[#f7f3ec] uppercase sm:py-2.5"
              >
                {isLoggedIn ? 'Checkout' : 'Sign in to checkout'}
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
