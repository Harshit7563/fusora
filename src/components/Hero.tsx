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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(60,5,5,0.15)_0%,rgba(7,0,1,0.55)_70%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#3a0505] to-transparent" />

            <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center px-5 text-center">
              <p className="font-display text-sm tracking-[0.45em] text-[#f3dcb0] sm:text-lg">
                {slide.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-[3.5rem] leading-none tracking-[0.12em] text-[#ffc462] sm:text-7xl md:text-[5.5rem] lg:text-[6rem]">
                {slide.title}
              </h1>
              <p className="mt-2 font-display text-[0.8rem] tracking-[0.35em] text-[#f3dcb0] sm:text-base">
                {slide.line}
              </p>
              <Link
                to={slide.to}
                className="btn-primary mt-7 pointer-events-auto"
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
