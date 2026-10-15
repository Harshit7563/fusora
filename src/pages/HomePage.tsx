import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { CategoryStrip } from '../components/CategoryStrip'
import { FaqSection } from '../components/FaqSection'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { ReviewsSection } from '../components/ReviewsSection'
import { TrendingDeals } from '../components/TrendingDeals'
import { useCatalog } from '../hooks/useCatalog'

const savingsBanners = [
  {
    title: 'Kurta & Apparel',
    offer: 'FLAT 40% OFF',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Sarees',
    offer: 'FLAT 30%–50% OFF',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Men’s Denim',
    offer: 'UP TO 40% OFF',
    to: '/category/men/jeans',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
]

const festiveTiles = [
  {
    label: 'Wedding Sarees',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
  },
  {
    label: 'Festive Wear',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
  },
  {
    label: 'Everyday Jeans',
    to: '/category/men/jeans',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85',
  },
  {
    label: 'Jewellery',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=85',
  },
]

const shadeCards = [
  {
    word: 'Radiant',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Enchanting',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    word: 'Gorgeous',
    to: '/deals',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  },
]

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const favourites = products.filter((p) => p.topDeal).slice(0, 4)
  const favouritesRow =
    favourites.length >= 4
      ? favourites
      : products.filter((p) => p.subtype === 'sarees').slice(0, 4)

  return (
    <main>
      <Hero />
      <CategoryStrip />

      {/* THE SAVINGS EDIT — Koskii style */}
      <section className="bg-white px-3 py-10 sm:px-5 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-section mb-8 text-center text-[0.78rem] sm:mb-10 sm:text-[0.85rem]">
            The Savings Edit
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {savingsBanners.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={b.to}
                  className="group relative block aspect-[3/4] overflow-hidden gold-frame"
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-3 py-5 text-center text-white">
                    <p className="text-[0.72rem] font-medium tracking-[0.16em] uppercase">
                      {b.title}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-wide text-[#e8c84a] sm:text-xl">
                      {b.offer}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Festive tiles */}
      <section className="bg-white px-3 pb-6 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-section mb-8 text-center text-[0.78rem] sm:text-[0.85rem]">
            Festive Glam
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {festiveTiles.map((t) => (
              <Link
                key={t.label}
                to={t.to}
                className="group relative aspect-[4/5] overflow-hidden gold-frame"
              >
                <img
                  src={t.image}
                  alt={t.label}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/25" />
                <p className="absolute inset-x-0 bottom-3 text-center font-serif text-sm italic tracking-wide text-white sm:text-base">
                  {t.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shades row */}
      <section className="bg-white px-3 py-10 sm:px-5 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-section mb-8 text-center text-[0.78rem] sm:text-[0.85rem]">
            Shades of Fusora
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {shadeCards.map((c) => (
              <Link
                key={c.word}
                to={c.to}
                className="group relative aspect-[3/4] overflow-hidden gold-frame"
              >
                <img
                  src={c.image}
                  alt={c.word}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-5 text-center font-serif text-2xl text-white sm:text-3xl">
                  {c.word}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Favourites */}
      <section className="bg-white px-3 py-10 sm:px-5 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-medium tracking-[0.22em] text-[#776865] uppercase">
                Loved, worn, repeated
              </p>
              <h2 className="text-display mt-1 text-[1.65rem] text-[#5c2a2a] sm:text-4xl">
                Your favourites. For a reason.
              </h2>
            </div>
            <Link
              to="/deals"
              className="text-[0.7rem] font-semibold tracking-[0.14em] text-[#5c2a2a] uppercase underline underline-offset-4"
            >
              Shop bestsellers →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
            {favouritesRow.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <TrendingDeals />
      <ReviewsSection />
      <FaqSection />
    </main>
  )
}
