import { Link } from 'react-router-dom'
import { FusoraLogo } from './FusoraLogo'

export function DualBanners() {
  return (
    <section className="bg-bb-gray px-4 pb-4 lg:px-6">
      <div className="mx-auto grid max-w-[1400px] gap-3 md:grid-cols-2">
        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003b9d] via-bb-blue to-[#00a3e0] p-6 text-white sm:min-h-[260px] sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <FusoraLogo compact />
            <span className="text-xs font-bold tracking-wide uppercase opacity-90">
              Member exclusive
            </span>
          </div>
          <h2 className="max-w-sm text-2xl font-bold tracking-tight sm:text-3xl">
            This is the season to{' '}
            <span className="text-[#7CFF6B]">go all in</span>
          </h2>
          <p className="mt-2 max-w-sm text-sm text-white/85">
            Game day tech, TVs, and audio — curated picks for kickoff.
          </p>
          <Link
            to="/category/parents-kids-toys"
            className="mt-5 inline-flex rounded-full border-2 border-white px-5 py-2 text-sm font-bold hover:bg-white/10"
          >
            Shop gameday tech
          </Link>
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=500&q=80"
            alt=""
            className="pointer-events-none absolute right-0 bottom-0 hidden h-40 w-40 rounded-tl-2xl object-cover opacity-80 sm:block md:h-48 md:w-48"
          />
        </article>

        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066e0] to-[#00b4d8] p-6 text-white sm:min-h-[260px] sm:p-8">
          <p className="text-sm font-bold tracking-wide text-white/90">
            DEAL OF THE DAY
          </p>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-bb-yellow sm:text-4xl">
            Up to 40%
            <br />
            off select TVs
          </h2>
          <p className="mt-3 max-w-xs text-sm text-white/90">
            Huge savings on Samsung, LG, and more — today only.
          </p>
          <Link
            to="/deals"
            className="mt-5 inline-flex rounded-full border-2 border-white px-5 py-2 text-sm font-bold hover:bg-white/10"
          >
            Shop now
          </Link>
          <img
            src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80"
            alt=""
            className="pointer-events-none absolute right-0 bottom-0 hidden h-40 w-48 rounded-tl-2xl object-cover opacity-75 sm:block"
          />
        </article>
      </div>
    </section>
  )
}
