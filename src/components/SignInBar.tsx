import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SignInBar() {
  return (
    <section className="bg-bb-gray px-4 pb-4 lg:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 rounded-2xl border border-bb-border bg-white px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bb-gray text-bb-blue">
            <User className="size-5" />
          </span>
          <p className="text-sm leading-snug text-bb-text">
            <span className="font-semibold">
              Sign in for free shipping*, recommendations, easy order tracking
              and more.
            </span>{' '}
            <Link to="/support" className="font-semibold text-bb-link hover:underline">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Link
            to="/account"
            className="bg-bb-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-bb-blue-dark"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="border border-bb-border bg-white px-5 py-2.5 text-sm font-bold text-bb-text hover:bg-bb-gray"
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  )
}
