import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { CategoryStrip } from '../components/CategoryStrip'
import { FaqSection } from '../components/FaqSection'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { ReviewsSection } from '../components/ReviewsSection'
import { TrendingDeals } from '../components/TrendingDeals'
import { TrustBar } from '../components/TrustBar'
import { products } from '../data'

export function HomePage() {
  usePageTitle()
  const banarasi = products
    .filter(
      (p) =>
        p.subtype === 'sarees' &&
        /banarasi|silk|kanjivaram/i.test(
          `${p.categoryName || ''} ${p.name}`,
        ),
    )
    .slice(0, 4)
  const featuredSarees =
    banarasi.length >= 4
      ? banarasi
      : products.filter((p) => p.subtype === 'sarees').slice(0, 4)

  const featuredJeans = products
    .filter((p) => p.subtype === 'jeans' && p.topDeal)
    .slice(0, 4)
  const jeansRow =
    featuredJeans.length >= 4
      ? featuredJeans
      : products.filter((p) => p.subtype === 'jeans').slice(0, 4)

  return (
    <main>
      <Hero />
      <TrustBar />
      <CategoryStrip />
      <TrendingDeals />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-bb-blue-deep/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto max-w-2xl px-4 py-20 text-center text-[#fbf7f2] sm:px-6 sm:py-24"
        >
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-white/80 uppercase">
            Featured edit
          </p>
          <h2 className="text-display mt-3 text-[2.1rem] leading-tight sm:text-5xl">
            Banarasi & Silk Sarees
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85">
            Beautiful weaves at special prices — for weddings, festivals and
            everyday elegance.
          </p>
          <Link
            to="/category/apparel-accessories/sarees/banarasi-sarees"
            className="mt-8 inline-flex bg-white px-8 py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-[#323232] uppercase transition hover:bg-[#f5f5f5]"
          >
            Shop Banarasi
          </Link>
        </motion.div>
      </section>

      <section className="bg-fusora-ivory px-3 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-medium tracking-[0.28em] text-bb-blue uppercase">
                Just in
              </p>
              <h2 className="text-display mt-2 text-[1.85rem] text-bb-text sm:text-4xl">
                Saree favourites
              </h2>
            </div>
            <Link
              to="/category/apparel-accessories/sarees"
              className="nav-link text-[0.7rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
            {featuredSarees.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <Link
          to="/category/apparel-accessories/sarees"
          className="group relative min-h-[46svh] overflow-hidden bg-bb-gray"
        >
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-bb-blue-deep/45 transition group-hover:bg-bb-blue-deep/55" />
          <div className="relative flex h-full min-h-[46svh] flex-col items-center justify-end px-6 py-12 text-center text-white">
            <p className="text-[0.65rem] tracking-[0.28em] uppercase opacity-85">
              Collection
            </p>
            <h2 className="text-display mt-2 text-4xl sm:text-5xl">Sarees</h2>
            <span className="mt-5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase underline underline-offset-8">
              Shop now
            </span>
          </div>
        </Link>
        <Link
          to="/category/apparel-accessories/jeans"
          className="group relative min-h-[46svh] overflow-hidden bg-bb-gray"
        >
          <img
            src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-bb-blue-deep/45 transition group-hover:bg-bb-blue-deep/55" />
          <div className="relative flex h-full min-h-[46svh] flex-col items-center justify-end px-6 py-12 text-center text-white">
            <p className="text-[0.65rem] tracking-[0.28em] uppercase opacity-85">
              Collection
            </p>
            <h2 className="text-display mt-2 text-4xl sm:text-5xl">Jeans</h2>
            <span className="mt-5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase underline underline-offset-8">
              Shop now
            </span>
          </div>
        </Link>
      </section>

      <section className="bg-white px-3 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-medium tracking-[0.28em] text-bb-blue uppercase">
                Denim
              </p>
              <h2 className="text-display mt-2 text-[1.85rem] text-bb-text sm:text-4xl">
                Everyday jeans
              </h2>
            </div>
            <Link
              to="/category/apparel-accessories/jeans"
              className="nav-link text-[0.7rem] font-semibold tracking-[0.14em] text-bb-text uppercase"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
            {jeansRow.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
      <FaqSection />
    </main>
  )
}
