import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative min-h-[70svh] overflow-hidden bg-bb-blue sm:min-h-[78svh]">
      <img
        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bb-blue via-bb-blue/55 to-bb-blue/25" />

      <div className="relative mx-auto flex min-h-[70svh] max-w-[1100px] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[78svh] sm:px-6 sm:py-20">
        <p className="mb-4 text-[0.65rem] font-medium tracking-[0.28em] text-[#e8dfd0] uppercase sm:mb-5 sm:text-[0.7rem] sm:tracking-[0.35em]">
          Fusora · fusora.shop
        </p>
        <h1 className="text-display max-w-3xl text-[2.15rem] leading-[1.12] text-[#f7f3ec] sm:text-5xl md:text-6xl lg:text-7xl">
          Chosen, never merely stocked.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed tracking-wide text-[#e8dfd0]/90 sm:mt-5 sm:text-base">
          From trusted brands to everyday essentials — curated for the way you
          live, shop, and gift.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Link
            to="/category/apparel-accessories"
            className="rounded-full bg-[#f7f3ec] px-7 py-3.5 text-center text-xs font-semibold tracking-[0.18em] text-bb-text uppercase transition hover:bg-white"
          >
            Shop apparel
          </Link>
          <Link
            to="/category/luggage-bags-cases"
            className="rounded-full border border-[#e8dfd0]/50 px-7 py-3.5 text-center text-xs font-semibold tracking-[0.18em] text-[#f7f3ec] uppercase transition hover:bg-white/10"
          >
            Shop luggage
          </Link>
        </div>
      </div>
    </section>
  )
}
