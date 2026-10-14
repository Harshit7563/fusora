import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 'sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_15%]',
    eyebrow: 'Women · Sarees',
    title: 'Silk & Banarasi, ready for every celebration',
    line: 'Festive weaves with a clean fall — chosen for evenings that matter.',
    cta: 'Shop sarees',
    to: '/category/women/sarees',
  },
  {
    id: 'men',
    image:
      'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_20%]',
    eyebrow: 'Men',
    title: 'Jeans, shirts and everyday denim',
    line: 'Men only — fits and washes for workdays and weekends.',
    cta: 'Shop men',
    to: '/category/men',
  },
  {
    id: 'women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    eyebrow: 'Women',
    title: 'Apparel made for how you move',
    line: 'Women only — sarees, jeans and ready-to-wear in one edit.',
    cta: 'Shop women',
    to: '/category/women',
  },
  {
    id: 'jewellery',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2400&q=85',
    position: 'object-center',
    eyebrow: 'Jewellery',
    title: 'Finishing pieces that catch the light',
    line: 'Gold-tone sets and everyday jewellery for festive and daily wear.',
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
    }, 6000)
    return () => window.clearInterval(id)
  }, [])

  // Warm the next image so slides feel instant
  useEffect(() => {
    const next = slides[(index + 1) % slides.length]
    const img = new Image()
    img.src = next.image
  }, [index])

  return (
    <section className="relative min-h-[58svh] overflow-hidden bg-[#1c1c1c] sm:min-h-[70svh] lg:min-h-[78svh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.eyebrow}
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.5, ease: 'linear' }}
            className={`h-full w-full object-cover ${slide.position}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Soft side wash — keeps the photo bright */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10 sm:from-black/65 sm:via-black/25 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      <div className="relative mx-auto flex min-h-[58svh] max-w-[1400px] flex-col justify-end px-4 pb-16 pt-20 sm:min-h-[70svh] sm:px-8 sm:pb-20 lg:min-h-[78svh] lg:justify-center lg:pb-0 lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-left"
          >
            <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.22em] text-white/90 uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="text-display text-[1.85rem] leading-[1.12] text-white sm:text-4xl md:text-[3rem]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/88 sm:text-[0.95rem]">
              {slide.line}
            </p>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <Link
                to={slide.to}
                className="inline-flex items-center justify-center bg-white px-8 py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-[#1f1f1f] uppercase transition hover:bg-[#f5f5f5]"
              >
                {slide.cta}
              </Link>
              <Link
                to="/deals"
                className="inline-flex items-center justify-center border border-white/80 px-7 py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-white/10"
              >
                New in
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap gap-2 lg:absolute lg:right-8 lg:bottom-10 lg:mt-0 lg:max-w-none">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`px-3.5 py-2 text-[0.62rem] font-semibold tracking-[0.14em] uppercase transition ${
                i === index
                  ? 'bg-white text-[#1f1f1f]'
                  : 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
              }`}
            >
              {s.id === 'sarees'
                ? 'Sarees'
                : s.id === 'men'
                  ? 'Men'
                  : s.id === 'women'
                    ? 'Women'
                    : 'Jewellery'}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
