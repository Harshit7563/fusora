import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SafeImage } from './SafeImage'

const featured = [
  {
    id: 'sarees',
    title: 'Sarees',
    line: 'Silk, Banarasi & handloom.',
    to: '/category/apparel-accessories/sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'jeans',
    title: 'Jeans',
    line: 'Men · Women · Kids denim.',
    to: '/category/apparel-accessories/jeans',
    image:
      'https://thedenimforge.com/uploads/products/1789985439763-lnhn91.webp',
  },
  {
    id: 'jewelry-eyewear-watches',
    title: 'Jewellery',
    line: 'Finishing pieces for every look.',
    to: '/category/jewelry-eyewear-watches',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'luggage-bags-cases',
    title: 'Luggage',
    line: 'Travel-ready essentials.',
    to: '/category/luggage-bags-cases',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
  },
]

export function CategoryStrip() {
  return (
    <section className="bg-fusora-ivory px-3 py-12 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-bb-blue uppercase">
            Shop by category
          </p>
          <h2 className="text-display mt-2 text-[2rem] leading-none text-bb-text sm:text-4xl">
            The Heritage Collection
          </h2>
          <p className="mt-3 text-sm text-bb-muted">
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
                <div className="absolute inset-x-0 bottom-0 px-3 py-4 text-center text-white sm:py-5">
                  <span className="block text-[0.85rem] font-medium tracking-[0.16em] uppercase sm:text-[0.9rem]">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[0.7rem] text-white/80">
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
