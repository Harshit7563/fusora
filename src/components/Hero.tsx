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
  to: string
}

const slides: Slide[] = [
  {
    id: 'festive',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_25%]',
    eyebrow: 'Weaves made for',
    title: 'Festive Season',
    line: 'Handcrafted sarees & ethnic wear for every celebration',
    to: '/category/women/sarees',
  },
  {
    id: 'wedding',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    eyebrow: 'By Fusora',
    title: 'Wedding Edit',
    line: 'Pieces chosen for the moments that matter',
    to: '/category/women',
  },
  {
    id: 'banarasi',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_30%]',
    eyebrow: 'Silk stories',
    title: 'Banarasi Collection',
    line: 'The richness of silk, the intricacy of brocade',
    to: '/category/women/sarees',
  },
  {
    id: 'men',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_20%]',
    eyebrow: 'For him',
    title: 'Men’s Collection',
    line: 'Everyday polish, tailored ease',
    to: '/category/men',
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [index])

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[min(72svh,640px)] min-h-[380px] overflow-hidden bg-[#3a1018]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className={`h-full w-full object-cover ${slide.position || 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 lg:px-20">
            <p className="font-serif text-base italic text-white/90 sm:text-lg">
              {slide.eyebrow}
            </p>
            <h1 className="mt-1 font-serif text-4xl tracking-[0.04em] text-white uppercase sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/90 sm:text-base">
              {slide.line}
            </p>
            <Link to={slide.to} className="btn-shop mt-7">
              Shop Now
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-3 z-[2] hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur-sm transition hover:bg-white/40 sm:grid"
      >
        <ChevronLeft className="size-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        className="absolute top-1/2 right-3 z-[2] hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white backdrop-blur-sm transition hover:bg-white/40 sm:grid"
      >
        <ChevronRight className="size-5" strokeWidth={1.5} />
      </button>

      <div className="absolute inset-x-0 bottom-5 z-[2] flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-[3px] rounded-full transition ${
              i === index ? 'w-8 bg-white' : 'w-5 bg-white/45'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
