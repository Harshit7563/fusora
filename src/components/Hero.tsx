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
  to: string
  align?: 'left' | 'center' | 'right'
}

const slides: Slide[] = [
  {
    id: 'fusora',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_25%]',
    title: 'Fusora',
    line: 'Handwoven for the moments that matter',
    to: '/category/women/sarees',
    align: 'right',
  },
  {
    id: 'banarasi',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_30%]',
    title: 'Banarasi Silk',
    line: 'The richness of silk, the intricacy of brocade',
    to: '/category/women/sarees',
    align: 'center',
  },
  {
    id: 'wedding',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    title: 'Wedding Edit',
    line: 'Pieces chosen for celebrations that last',
    to: '/category/women',
    align: 'right',
  },
  {
    id: 'men',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_20%]',
    title: 'Men’s Collection',
    line: 'Everyday polish, tailored ease',
    to: '/category/men',
    align: 'center',
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 7000)
    return () => window.clearInterval(id)
  }, [index])

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  const alignClass =
    slide.align === 'left'
      ? 'items-start text-left'
      : slide.align === 'right'
        ? 'items-end text-right'
        : 'items-center text-center'

  return (
    <section className="relative mx-auto max-w-[1440px] px-2 pt-2 sm:px-3 sm:pt-3 lg:px-4">
      <div className="relative h-[min(78svh,720px)] min-h-[420px] overflow-hidden">
        {/* Thin gold frame — Nalli */}
        <div
          className="pointer-events-none absolute inset-2 z-[2] border border-[#c4a574]/70 sm:inset-3"
          aria-hidden
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt=""
              className={`h-full w-full object-cover ${slide.position || 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/15" />
            <div
              className={`absolute inset-0 flex flex-col justify-center px-8 sm:px-14 lg:px-20 ${alignClass}`}
            >
              {slide.title !== 'Fusora' && (
                <p className="mb-2 font-serif text-sm tracking-[0.2em] text-white/90 uppercase sm:text-base">
                  Fusora
                </p>
              )}
              <h1 className="font-serif text-4xl tracking-[0.06em] text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-md text-sm text-white/90 sm:text-base">
                {slide.line}
              </p>
              <Link to={slide.to} className="btn-gold mt-7 inline-flex">
                Explore Now
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-5 bottom-5 z-[3] flex items-center gap-2 sm:right-8 sm:bottom-8">
          <div className="mr-2 hidden h-px w-16 bg-white/50 sm:block" />
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(-1)}
            className="grid size-9 place-items-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/35"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => go(1)}
            className="grid size-9 place-items-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/35"
          >
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}
