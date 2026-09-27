import { Link } from 'react-router-dom'

const featured = [
  {
    id: 'apparel-accessories',
    title: 'Apparel & Clothes',
    line: 'Everyday essentials, chosen with care.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'luggage-bags-cases',
    title: 'Luggage',
    line: 'Travel-ready pieces for every journey.',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40370597_1-safari.jpg',
  },
  {
    id: 'jewelry-eyewear-watches',
    title: 'Artificial Jewellery',
    line: 'Finishing touches, chosen with care.',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40360775_1-jewelz.jpg',
  },
]

export function CategoryStrip() {
  const homeCats = featured
  return (
    <section className="bg-fusora-ivory px-3 py-12 sm:px-4 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.7rem] font-medium tracking-[0.3em] text-bb-muted uppercase">
            Collections
          </p>
          <h2 className="text-display mt-3 text-[1.65rem] leading-snug text-bb-text sm:text-4xl">
            Not everything listed deserves a place in your cart.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-bb-muted sm:mt-4">
            We curate across categories — so you shop with clarity, not clutter.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {homeCats.map((item) => (
            <Link
              key={item.id}
              to={`/category/${item.id}`}
              className="group relative aspect-[16/10] overflow-hidden bg-bb-gray sm:aspect-[4/5]"
            >
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bb-blue/80 via-bb-blue/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-[#f7f3ec] sm:p-6">
                <h3 className="text-display text-xl sm:text-2xl">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[#e8dfd0]/90">
                  {item.line}
                </p>
                <span className="mt-3 inline-block text-[0.65rem] tracking-[0.2em] uppercase underline-offset-4 group-hover:underline sm:mt-4">
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
