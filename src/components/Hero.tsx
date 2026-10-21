import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Slide = {
  id: string
  image: string
  position?: string
  eyebrow: string
  title: string
  line: string
  cta: string
  to: string
}

const slides: Slide[] = [
  {
    id: 'sarees',
    image: '/heroes/ai-saree.jpg?v=2',
    position: 'object-[center_30%]',
    eyebrow: 'Festive edit',
    title: 'Saree Drop',
    line: 'Silk, zari & celebration drapes',
    cta: 'Shop Sarees',
    to: '/category/women/sarees',
  },
  {
    id: 'wedding',
    image: '/heroes/ai-wedding.jpg?v=2',
    position: 'object-[center_25%]',
    eyebrow: 'Big day looks',
    title: 'Wedding Edit',
    line: 'Reds, golds & occasion wear',
    cta: 'Shop Now',
    to: '/category/women',
  },
  {
    id: 'men',
    image: '/heroes/ai-men.jpg?v=2',
    position: 'object-[center_22%]',
    eyebrow: 'For him',
    title: "Men's Deck",
    line: 'Shirts, tees & denim essentials',
    cta: 'Shop Men',
    to: '/category/men',
  },
  {
    id: 'sale',
    image: '/heroes/ai-sale.jpg?v=2',
    position: 'object-[center_28%]',
    eyebrow: 'Limited time',
    title: 'Deal Live',
    line: 'Markdowns across the store',
    cta: 'Shop Sale',
    to: '/deals',
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => window.clearInterval(id)
  }, [index])

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  return (
    <section className="relative overflow-hidden bg-[#3a0505]">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9] lg:max-h-[720px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <motion.img
              src={slide.image}
              alt=""
              initial={{ scale: 1.07 }}
              animate={{ scale: 1.13 }}
              transition={{ duration: 18, ease: 'easeInOut' }}
              className={`absolute inset-0 h-full w-full object-cover ${slide.position || 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070001]/60 via-[#070001]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070001]/50 to-transparent" />

            <div className="absolute inset-0 z-[1] flex flex-col items-start justify-end px-5 pb-14 text-left sm:px-10 sm:pb-16">
              <p className="bg-[#cf2028] px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.22em] text-white uppercase sm:text-xs">
                {slide.eyebrow}
              </p>
              <h1 className="mt-3 font-heading text-6xl leading-[0.95] tracking-wide text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-7xl md:text-8xl">
                {slide.title}
              </h1>
              <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
                {slide.line}
              </p>
              <Link
                to={slide.to}
                className="mt-5 bg-white px-6 py-3 text-xs font-bold tracking-[0.16em] text-[#070001] uppercase transition hover:bg-[#cf2028] hover:text-white"
              >
                {slide.cta}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-2 z-[2] grid size-11 -translate-y-1/2 place-items-center bg-[#f8f6ee]/90 text-[#070001] transition hover:bg-white sm:left-4"
        >
          <ChevronLeft className="size-5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="absolute top-1/2 right-2 z-[2] grid size-11 -translate-y-1/2 place-items-center bg-[#f8f6ee]/90 text-[#070001] transition hover:bg-white sm:right-4"
        >
          <ChevronRight className="size-5" strokeWidth={2.2} />
        </button>

        <div className="absolute inset-x-0 bottom-5 z-[2] flex justify-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 scale-125 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
