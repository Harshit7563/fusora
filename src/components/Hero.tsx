import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2200&q=80',
    eyebrow: 'Festive edit',
    title: 'Designer Sarees for Every Occasion',
    line: 'Silk, Banarasi, handloom and festive weaves — chosen for how you celebrate.',
    cta: 'Shop sarees',
    to: '/category/apparel-accessories/sarees',
  },
  {
    id: 2,
    image: '/heroes/hero-denim.jpg',
    eyebrow: 'Denim edit',
    title: 'Jeans for Every Fit',
    line: 'Men, women and kids — washes, cuts and everyday staples.',
    cta: 'Shop jeans',
    to: '/category/apparel-accessories/jeans',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2200&q=80',
    eyebrow: 'Finishing touches',
    title: 'Jewellery That Completes the Look',
    line: 'Pieces for evenings, festivals and everyday grace.',
    cta: 'Shop jewellery',
    to: '/category/jewelry-eyewear-watches',
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
  }, [])

  return (
    <section className="relative min-h-[56svh] overflow-hidden bg-[#1a1a1a] sm:min-h-[68svh] md:min-h-[72svh]">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40 sm:bg-black/35" />

      <div className="relative mx-auto flex min-h-[56svh] max-w-[1400px] flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[68svh] sm:px-8 sm:py-16 md:min-h-[72svh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
          >
            <p className="mb-2 text-[0.62rem] font-medium tracking-[0.22em] text-white/85 uppercase sm:mb-3 sm:text-[0.68rem] sm:tracking-[0.28em]">
              {slide.eyebrow}
            </p>
            <h1 className="text-display text-[1.55rem] leading-[1.2] text-white sm:text-4xl md:text-[2.75rem]">
              {slide.title}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[0.8125rem] leading-relaxed text-white/85 sm:mt-4 sm:text-[0.95rem]">
              {slide.line}
            </p>
            <div className="mt-6 flex w-full flex-col items-stretch gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
              <Link
                to={slide.to}
                className="inline-flex items-center justify-center bg-white px-6 py-3.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[#323232] uppercase transition hover:bg-[#f5f5f5] sm:px-8 sm:text-[0.7rem]"
              >
                {slide.cta}
              </Link>
              <Link
                to="/deals"
                className="inline-flex items-center justify-center border border-white/70 px-6 py-3.5 text-[0.68rem] font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-white/10 sm:px-7 sm:text-[0.7rem]"
              >
                New in
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-500 ${
                i === index ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
