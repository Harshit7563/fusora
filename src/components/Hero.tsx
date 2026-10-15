import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/** Ethnic / occasion-wear only — no western street fashion */
const slides = [
  {
    id: 'festive',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_18%]',
    edit: 'The Garba Glow Edit',
    title: 'Everyday Elegance',
    accent: 'Rooted in Tradition',
    offer: 'FLAT 30%–50% OFF',
    cats: 'SAREES  ·  BANARASI  ·  SILK',
    cta: 'Shop Sarees',
    to: '/category/women/sarees',
  },
  {
    id: 'bridal',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    edit: 'The Wedding Edit',
    title: 'Moments that',
    accent: 'Deserve Silk',
    offer: 'UP TO 40% OFF',
    cats: 'BANARASI  ·  KANJIVARAM  ·  HANDLOOM',
    cta: 'Shop Now',
    to: '/category/women/sarees',
  },
  {
    id: 'jewellery',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_30%]',
    edit: 'The Finishing Edit',
    title: 'Jewellery that',
    accent: 'Catches Light',
    offer: 'FROM ₹499',
    cats: 'SETS  ·  EARRINGS  ·  NECKLACES',
    cta: 'Shop Jewellery',
    to: '/category/jewelry-eyewear-watches',
  },
  {
    id: 'men',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_20%]',
    edit: 'The Denim Edit',
    title: 'Men’s Everyday',
    accent: 'Clean Fits',
    offer: 'UP TO 40% OFF',
    cats: 'JEANS  ·  SHIRTS  ·  TEES',
    cta: 'Shop Men',
    to: '/category/men',
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
  }, [])

  useEffect(() => {
    const next = slides[(index + 1) % slides.length]
    const img = new Image()
    img.src = next.image
  }, [index])

  return (
    <section className="relative min-h-[78svh] overflow-hidden bg-[#2e1515] sm:min-h-[85svh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.title}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7.5, ease: 'linear' }}
            className={`h-full w-full object-cover ${slide.position}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Soft wash — photo stays visible, text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/35 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />

      <div className="relative mx-auto flex min-h-[78svh] max-w-[1440px] items-center justify-end px-4 pb-14 pt-24 sm:min-h-[85svh] sm:px-10 sm:pb-16 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-right text-white sm:max-w-lg"
          >
            <p className="text-[0.68rem] font-medium tracking-[0.32em] text-white/85 uppercase">
              {slide.edit}
            </p>

            <h1 className="text-display mt-4 text-[2.35rem] leading-[1.08] sm:text-5xl md:text-[3.25rem]">
              {slide.title}
              <span className="mt-1 block italic text-[#e8c84a]">
                {slide.accent}
              </span>
            </h1>

            <div className="mt-5 ml-auto h-px w-16 bg-[#c5a059]" />

            <p className="mt-5 text-2xl font-semibold tracking-[0.04em] text-[#e8c84a] sm:text-[1.85rem]">
              {slide.offer}
            </p>
            <p className="mt-3 text-[0.65rem] font-medium tracking-[0.2em] text-white/80 uppercase">
              {slide.cats}
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <Link
                to={slide.to}
                className="inline-flex items-center justify-center rounded-md bg-white px-9 py-3.5 text-[0.72rem] font-semibold tracking-[0.18em] text-[#1a1a1a] uppercase transition hover:bg-[#f7f5f3]"
              >
                {slide.cta}
              </Link>
              <Link
                to="/deals"
                className="inline-flex items-center justify-center rounded-md border border-white/70 px-6 py-3.5 text-[0.68rem] font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-white/10"
              >
                Sale
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to ${s.edit}`}
            onClick={() => setIndex(i)}
            className={`rounded-full transition ${
              i === index
                ? 'h-2.5 w-6 bg-[#e8c84a]'
                : 'size-2.5 bg-white/45 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
