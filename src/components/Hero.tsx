import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 'sarees',
    image:
      'https://images.unsplash.com/photo-1756483492198-8ca91227489b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_20%]',
    eyebrow: 'Sarees',
    title: 'Designer Sarees for Every Occasion',
    line: 'Silk, Banarasi, handloom and festive weaves — chosen for how you celebrate.',
    cta: 'Shop sarees',
    to: '/category/apparel-accessories/sarees',
  },
  {
    id: 'jeans',
    image: '/heroes/hero-denim.jpg',
    position: 'object-center',
    eyebrow: 'Jeans',
    title: 'Jeans for Every Fit',
    line: 'Men, women and kids — washes, cuts and everyday denim staples.',
    cta: 'Shop jeans',
    to: '/category/apparel-accessories/jeans',
  },
  {
    id: 'apparel',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_25%]',
    eyebrow: 'Apparel',
    title: 'Apparel Made to Wear Daily',
    line: 'Kurtis, shirts, tees and festive ready-to-wear — clean fits, easy style.',
    cta: 'Shop apparel',
    to: '/category/apparel-accessories',
  },
  {
    id: 'jewellery',
    image:
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=2400&q=85',
    position: 'object-center',
    eyebrow: 'Jewellery',
    title: 'Jewellery That Completes the Look',
    line: 'Gold-tone, festive sets and everyday pieces for evenings and celebrations.',
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
          alt={slide.eyebrow}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 h-full w-full object-cover ${slide.position}`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/25" />

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

        <div className="absolute bottom-5 left-1/2 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col items-center gap-3 sm:bottom-8">
          <div className="hidden w-full justify-center gap-4 text-[0.6rem] font-semibold tracking-[0.14em] text-white/75 uppercase sm:flex">
            {slides.map((s, i) => (
              <button
                key={`label-${s.id}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`transition ${
                  i === index ? 'text-white' : 'hover:text-white'
                }`}
              >
                {s.eyebrow}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.eyebrow}
                onClick={() => setIndex(i)}
                className={`h-1 transition-all duration-500 ${
                  i === index
                    ? 'w-8 bg-white'
                    : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
