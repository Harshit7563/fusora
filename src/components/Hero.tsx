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
    <section className="relative min-h-[70svh] overflow-hidden bg-bb-blue-deep sm:min-h-[78svh]">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-bb-blue-deep/88 via-bb-blue-deep/50 to-bb-blue-deep/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-bb-blue-deep/75 via-transparent to-bb-blue-deep/25" />

      <div className="relative mx-auto flex min-h-[70svh] max-w-[1440px] flex-col justify-end px-4 pb-14 sm:min-h-[78svh] sm:px-8 sm:pb-16 lg:justify-center lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="mb-3 text-[0.7rem] font-medium tracking-[0.3em] text-fusora-gold uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="text-display text-[2.2rem] leading-[1.08] text-[#fbf7f2] sm:text-5xl md:text-[3.5rem]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f3e8d8]/92 sm:text-[0.95rem]">
              {slide.line}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={slide.to}
                className="inline-flex bg-[#fbf7f2] px-8 py-3.5 text-[0.72rem] font-semibold tracking-[0.18em] text-bb-blue uppercase transition hover:bg-white"
              >
                {slide.cta}
              </Link>
              <Link
                to="/deals"
                className="inline-flex border border-[#fbf7f2]/55 px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.18em] text-[#fbf7f2] uppercase transition hover:bg-white/10"
              >
                New in
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-2 lg:absolute lg:right-8 lg:bottom-10 lg:left-auto">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index
                  ? 'w-10 bg-fusora-gold'
                  : 'w-5 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
