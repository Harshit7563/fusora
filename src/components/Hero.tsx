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
  align?: 'left' | 'right'
}

const slides: Slide[] = [
  {
    id: 'sarees',
    image: '/heroes/ai-saree.jpg',
    position: 'object-[center_30%]',
    eyebrow: 'New season',
    title: 'Saree Edit',
    line: 'Silk, zari and festive drapes — curated for every celebration.',
    cta: 'Shop Sarees',
    to: '/category/women/sarees',
    align: 'left',
  },
  {
    id: 'wedding',
    image: '/heroes/ai-wedding.jpg',
    position: 'object-[center_25%]',
    eyebrow: 'Occasion wear',
    title: 'Wedding Edit',
    line: 'Bridal reds and gold weaves made for the big day.',
    cta: 'Shop Now',
    to: '/category/women',
    align: 'right',
  },
  {
    id: 'men',
    image: '/heroes/ai-men.jpg',
    position: 'object-[center_22%]',
    eyebrow: 'For him',
    title: 'Men’s Drop',
    line: 'Sharp shirts, tees and denim for everyday polish.',
    cta: 'Shop Men',
    to: '/category/men',
    align: 'left',
  },
  {
    id: 'sale',
    image: '/heroes/ai-sale.jpg',
    position: 'object-[center_28%]',
    eyebrow: 'Limited time',
    title: 'Sale Live',
    line: 'Fresh markdowns across sarees, apparel and more.',
    cta: 'Shop Sale',
    to: '/deals',
    align: 'right',
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

  const alignRight = slide.align === 'right'

  return (
    <section className="relative h-[min(78svh,700px)] min-h-[420px] overflow-hidden bg-[#111]">
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
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.5, ease: 'linear' }}
            className={`absolute inset-0 h-full w-full object-cover ${slide.position || 'object-center'}`}
          />

          <div
            className={`absolute inset-0 ${
              alignRight
                ? 'bg-gradient-to-l from-black/65 via-black/20 to-transparent'
                : 'bg-gradient-to-r from-black/65 via-black/20 to-transparent'
            }`}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

          <div
            className={`absolute inset-0 z-[1] flex flex-col justify-end px-5 pb-16 sm:px-10 sm:pb-20 lg:px-16 ${
              alignRight ? 'items-end text-right' : 'items-start text-left'
            }`}
          >
            <p className="mb-2 text-[0.7rem] font-bold tracking-[0.2em] text-white/85 uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
              {slide.line}
            </p>
            <Link to={slide.to} className="btn-primary mt-6">
              {slide.cta}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#111] shadow-md transition hover:bg-white sm:left-5"
      >
        <ChevronLeft className="size-5" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        className="absolute top-1/2 right-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#111] shadow-md transition hover:bg-white sm:right-5"
      >
        <ChevronRight className="size-5" strokeWidth={2.2} />
      </button>

      <div className="absolute inset-x-0 bottom-5 z-[2] flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-7 bg-[#e30613]' : 'w-2 bg-white/75 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
