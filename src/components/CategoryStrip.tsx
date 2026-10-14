import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SafeImage } from './SafeImage'

const featured = [
  {
    id: 'men',
    title: 'Men',
    line: 'Men only — jeans, shirts & tees.',
    to: '/category/men',
    image: '/heroes/hero-denim.jpg',
  },
  {
    id: 'women',
    title: 'Women',
    line: 'Women only — sarees & apparel.',
    to: '/category/women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'sarees',
    title: 'Sarees',
    line: 'Silk, Banarasi & handloom.',
    to: '/category/women/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'jewelry-eyewear-watches',
    title: 'Jewellery',
    line: 'Finishing pieces for every look.',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=85',
  },
]

export function CategoryStrip() {
  return (
    <section className="bg-fusora-ivory px-3 py-9 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-10">
          <p className="text-[0.62rem] font-medium tracking-[0.22em] text-bb-blue uppercase sm:text-[0.68rem] sm:tracking-[0.28em]">
            Shop by category
          </p>
          <h2 className="text-display mt-2 text-[1.55rem] leading-tight text-bb-text sm:text-4xl">
            The Heritage Collection
          </h2>
          <p className="mt-2 text-sm text-bb-muted sm:mt-3">
            Classic designs that never go out of style.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={item.to}
                className="group relative block aspect-[3/4] overflow-hidden bg-bb-gray"
              >
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bb-blue-deep/80 via-bb-blue/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-2 py-3 text-center text-white sm:px-3 sm:py-5">
                  <span className="block text-[0.75rem] font-medium tracking-[0.12em] uppercase sm:text-[0.9rem] sm:tracking-[0.16em]">
                    {item.title}
                  </span>
                  <span className="mt-1 hidden text-[0.7rem] text-white/80 sm:block">
                    {item.line}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
