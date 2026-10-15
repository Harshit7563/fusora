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
  offer?: string
  to: string
}

const slides: Slide[] = [
  {
    id: 'festive',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    eyebrow: 'Weaves made for',
    title: 'Festive Season',
    line: 'Handcrafted sarees & ethnic wear for every celebration',
    offer: 'Fresh styles, added daily',
    to: '/category/women/sarees',
  },
  {
    id: 'wedding',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_18%]',
    eyebrow: 'By Fusora',
    title: 'Wedding Edit',
    line: 'Pieces chosen for the moments that matter',
    offer: 'Bridal & occasion weaves',
    to: '/category/women',
  },
  {
    id: 'banarasi',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_28%]',
    eyebrow: 'Silk stories',
    title: 'Banarasi Collection',
    line: 'The richness of silk, the intricacy of brocade',
    to: '/category/women/sarees',
  },
  {
    id: 'men',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_18%]',
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
    <section className="relative h-[min(74svh,680px)] min-h-[400px] overflow-hidden bg-[#3a1018]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0.4, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className={`h-full w-full object-cover ${slide.position || 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a0c12]/75 via-[#2a0c12]/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 lg:max-w-[55%] lg:px-16 xl:px-20">
            <p className="font-serif text-lg italic text-[#f7f0e6]/95 sm:text-xl">
              {slide.eyebrow}
            </p>
            <h1 className="mt-1 font-serif text-[2.35rem] leading-[1.05] tracking-[0.06em] text-[#f7f0e6] uppercase sm:text-5xl md:text-6xl lg:text-[3.5rem]">
              {slide.title}
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/88 sm:text-[0.95rem]">
              {slide.line}
            </p>
            <Link to={slide.to} className="btn-shop mt-7">
              Shop Now
            </Link>
            {slide.offer && (
              <p className="mt-5 text-[0.72rem] tracking-[0.14em] text-[#d4af77] uppercase">
                {slide.offer}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-3 z-[2] hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm transition hover:bg-black/30 sm:grid"
      >
        <ChevronLeft className="size-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        className="absolute top-1/2 right-3 z-[2] hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm transition hover:bg-black/30 sm:grid"
      >
        <ChevronRight className="size-5" strokeWidth={1.5} />
      </button>

      <div className="absolute inset-x-0 bottom-6 z-[2] flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-[2px] rounded-full transition-all duration-300 ${
              i === index ? 'w-9 bg-[#f7f0e6]' : 'w-5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
