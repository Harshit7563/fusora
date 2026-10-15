import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { CategoryStrip } from '../components/CategoryStrip'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'

export function HomePage() {
  usePageTitle()
  const { products } = useCatalog()
  const bestsellers = (
    products.filter((p) => p.topDeal).length >= 4
      ? products.filter((p) => p.topDeal)
      : products.filter((p) => p.subtype === 'sarees')
  ).slice(0, 4)

  return (
    <main className="bg-white">
      <Hero />
      <CategoryStrip />

      <section className="px-3 pb-14 sm:px-6 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-medium tracking-[0.22em] text-[#8a7e7a] uppercase">
                Loved, worn, repeated
              </p>
              <h2 className="mt-1 font-serif text-[1.55rem] text-[#5c2a2a] sm:text-3xl">
                Bestsellers
              </h2>
            </div>
            <Link
              to="/deals"
              className="text-[0.68rem] font-semibold tracking-[0.14em] text-[#5c2a2a] uppercase underline underline-offset-4"
            >
              Shop all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
