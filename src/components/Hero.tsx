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
    eyebrow: 'Festive Edit',
    title: 'Sarees From ₹999',
    line: 'Silk, zari & celebration drapes',
    cta: 'Shop Sarees',
    to: '/category/women/sarees',
  },
  {
    id: 'wedding',
    image: '/heroes/ai-wedding.jpg?v=2',
    position: 'object-[center_25%]',
    eyebrow: 'New Season',
    title: 'Dresses From ₹999',
    line: 'Twirl-ready fits for every plan',
    cta: 'Shop Now',
    to: '/category/women/dresses',
  },
  {
    id: 'men',
    image: '/heroes/men-hero-v2.jpg',
    position: 'object-[center_18%]',
    eyebrow: 'For Him',
    title: "Men's Essentials",
    line: 'Tees, shirts & denim for every day',
    cta: 'Shop Men',
    to: '/category/men',
  },
  {
    id: 'sale',
    image: '/heroes/ai-sale.jpg?v=2',
    position: 'object-[center_28%]',
    eyebrow: 'Limited Time',
    title: 'Up To 50% Off*',
    line: 'Deal of the day — grab it before midnight',
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
    <section className="relative overflow-hidden bg-white">
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
            <div className="absolute inset-0 bg-gradient-to-l from-[#070001]/70 via-[#070001]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070001]/45 to-transparent" />

            <div className="absolute inset-0 z-[1] flex flex-col items-end justify-center px-5 text-right sm:px-10 lg:px-16">
              <p className="font-heading text-xl tracking-[0.14em] text-[#ffc462] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-3xl">
                {slide.eyebrow}
              </p>
              <h1 className="mt-1 max-w-xl font-heading text-5xl leading-[0.95] tracking-wide text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-7xl lg:text-8xl">
                {slide.title}
              </h1>
              <p className="mt-2 text-sm font-bold tracking-wide text-[#ffc462] uppercase sm:text-base">
                {slide.line}
              </p>
              <Link
                to={slide.to}
                className="mt-5 bg-[#cf2028] px-7 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase transition hover:bg-white hover:text-[#070001]"
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

      </div>

      <div className="flex justify-center gap-2 py-3.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`size-2 rounded-full transition-all ${
              i === index ? 'scale-110 bg-[#0e7c86]' : 'bg-[#cfd8da]'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
