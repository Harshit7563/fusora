import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/** Koskii-style full-bleed promo slides — ethnic occasion wear only */
const slides = [
  {
    id: 'garba',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_18%]',
    line1: 'THE',
    line2: 'FESTIVE GLOW',
    line3: 'EDIT',
    offer: 'FLAT 30%–50% OFF',
    cats: 'SAREES  |  BANARASI  |  SILK  |  JEWELLERY',
    to: '/category/women/sarees',
  },
  {
    id: 'saree',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_20%]',
    line1: 'THE',
    line2: 'SILK EDIT',
    line3: '',
    offer: 'UP TO 40% OFF',
    cats: 'BANARASI  |  KANJIVARAM  |  HANDLOOM',
    to: '/category/women/sarees',
  },
  {
    id: 'jewels',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_28%]',
    line1: 'THE',
    line2: 'FINISHING',
    line3: 'EDIT',
    offer: 'FROM ₹499',
    cats: 'SETS  |  EARRINGS  |  NECKLACES',
    to: '/category/jewelry-eyewear-watches',
  },
  {
    id: 'men',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_22%]',
    line1: 'THE',
    line2: 'DENIM',
    line3: 'EDIT',
    offer: 'UP TO 40% OFF',
    cats: 'JEANS  |  SHIRTS  |  TEES',
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
  }, [])

  useEffect(() => {
    const img = new Image()
    img.src = slides[(index + 1) % slides.length].image
  }, [index])

  return (
    <section className="relative h-[min(92svh,920px)] min-h-[560px] overflow-hidden bg-[#1a1210]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75 }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt=""
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: 'linear' }}
            className={`h-full w-full object-cover ${slide.position}`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/25 to-black/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25" />

      <div className="relative flex h-full items-center justify-end px-5 pb-16 pt-24 sm:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="max-w-md text-center text-white sm:max-w-lg sm:text-right"
          >
            <p className="font-serif text-lg italic tracking-wide text-white/90 sm:text-xl">
              {slide.line1}
            </p>
            <h1 className="text-display mt-1 text-[2.6rem] leading-[0.98] sm:text-5xl md:text-[3.6rem]">
              {slide.line2}
              {slide.line3 ? (
                <span className="mt-1 block text-[1.6rem] tracking-[0.12em] sm:text-3xl">
                  {slide.line3}
                </span>
              ) : null}
            </h1>
            <p className="mt-5 text-[1.65rem] font-semibold tracking-wide text-[#e8c84a] sm:text-[2rem]">
              {slide.offer}
            </p>
            <p className="mt-3 text-[0.62rem] font-medium tracking-[0.16em] text-white/85 uppercase sm:text-[0.68rem]">
              {slide.cats}
            </p>
            <div className="mt-8 flex justify-center sm:justify-end">
              <Link
                to={slide.to}
                className="inline-flex items-center justify-center rounded-[4px] bg-white px-10 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-[#1a1a1a] uppercase transition hover:bg-[#f7f5f3]"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Koskii-style dash indicators */}
      <div className="absolute inset-x-0 bottom-7 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-[3px] rounded-full transition ${
              i === index ? 'w-7 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
