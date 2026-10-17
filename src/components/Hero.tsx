import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Slide = {
  id: string
  image: string
  position?: string
  title: string
  line: string
  cta: string
  to: string
}

const slides: Slide[] = [
  {
    id: 'sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    title: 'Saree Edit',
    line: 'Handpicked weaves for every celebration',
    cta: 'Shop Now',
    to: '/category/women/sarees',
  },
  {
    id: 'men',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_18%]',
    title: 'Men’s Drop',
    line: 'Shirts, tees & denim built for everyday',
    cta: 'Shop Men',
    to: '/category/men',
  },
  {
    id: 'women',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_20%]',
    title: 'Women’s Edit',
    line: 'Festive looks, everyday ease',
    cta: 'Shop Women',
    to: '/category/women',
  },
  {
    id: 'sale',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_28%]',
    title: 'Sale',
    line: 'Limited pieces. Fresh markdowns.',
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
    }, 5500)
    return () => window.clearInterval(id)
  }, [index])

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[min(70svh,620px)] min-h-[360px] overflow-hidden bg-[#111]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <Link to={slide.to} className="absolute inset-0 block">
            <img
              src={slide.image}
              alt=""
              className={`h-full w-full object-cover ${slide.position || 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          </Link>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex flex-col items-start justify-end px-5 pb-14 sm:px-10 sm:pb-16 lg:px-14">
            <p className="text-3xl font-extrabold tracking-tight text-white uppercase sm:text-5xl">
              {slide.title}
            </p>
            <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
              {slide.line}
            </p>
            <Link
              to={slide.to}
              className="pointer-events-auto btn-primary mt-5"
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
        className="absolute top-1/2 left-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#111] shadow transition hover:bg-white"
      >
        <ChevronLeft className="size-5" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        className="absolute top-1/2 right-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#111] shadow transition hover:bg-white"
      >
        <ChevronRight className="size-5" strokeWidth={2.2} />
      </button>

      <div className="absolute inset-x-0 bottom-4 z-[2] flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`size-2 rounded-full transition ${
              i === index ? 'bg-[#e30613] scale-110' : 'bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
