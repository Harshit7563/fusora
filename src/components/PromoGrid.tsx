import { Link } from 'react-router-dom'
import { promoCards } from '../data'

export function PromoGrid() {
  return (
    <section className="bg-bb-gray px-4 pb-4 lg:px-6">
      <div className="mx-auto grid max-w-[1400px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {promoCards.map((card) => (
          <article
            key={card.id}
            className="group relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl text-white"
            style={{ background: card.gradient }}
          >
            <div className="relative z-10 px-5 pt-6">
              <h2 className="text-2xl font-bold tracking-tight">{card.title}</h2>
            </div>
            <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-4">
              <img
                src={card.image}
                alt=""
                className="h-44 w-auto max-w-[85%] rounded-xl object-cover shadow-2xl transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 mt-auto px-5 pb-6">
              <p className="mb-4 text-sm leading-snug text-white/90">{card.body}</p>
              <Link
                to="/deals"
                className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-bb-text hover:bg-bb-yellow"
              >
                {card.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
