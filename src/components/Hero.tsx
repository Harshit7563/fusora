import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 'sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_20%]',
    edit: 'THE FESTIVE EDIT',
    title: 'Silk & Banarasi',
    offer: 'FLAT 30%–50% OFF',
    cats: 'SAREES  ·  BANARASI  ·  HANDLOOM',
    cta: 'Shop Now',
    to: '/category/women/sarees',
  },
  {
    id: 'women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_22%]',
    edit: 'THE NEW SEASON EDIT',
    title: 'Women’s Collection',
    offer: 'FLAT 20%–40% OFF',
    cats: 'SAREES  ·  APPAREL  ·  JEWELLERY',
    cta: 'Shop Now',
    to: '/category/women',
  },
  {
    id: 'men',
    image:
      'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_18%]',
    edit: 'THE DENIM EDIT',
    title: 'Men’s Everyday',
    offer: 'UP TO 40% OFF',
    cats: 'JEANS  ·  SHIRTS  ·  TEES',
    cta: 'Shop Now',
    to: '/category/men',
  },
  {
    id: 'jewellery',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2400&q=85',
    position: 'object-center',
    edit: 'THE FINISHING EDIT',
    title: 'Jewellery Lights',
    offer: 'FROM ₹499',
    cats: 'SETS  ·  EARRINGS  ·  NECKLACES',
    cta: 'Shop Now',
    to: '/category/jewelry-eyewear-watches',
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
    const next = slides[(index + 1) % slides.length]
    const img = new Image()
    img.src = next.image
  }, [index])

  return (
    <section className="relative min-h-[88svh] overflow-hidden bg-[#2e1515] sm:min-h-[92svh]">
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
            alt={slide.title}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: 'linear' }}
            className={`h-full w-full object-cover ${slide.position}`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

      <div className="relative mx-auto flex min-h-[88svh] max-w-[1440px] items-center justify-end px-4 pb-16 pt-28 sm:min-h-[92svh] sm:px-10 sm:pb-20 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="max-w-md text-right text-white sm:max-w-lg"
          >
            <p className="text-[0.7rem] font-medium tracking-[0.28em] text-white/90 uppercase">
              {slide.edit}
            </p>
            <h1 className="text-display mt-3 text-[2.4rem] leading-[1.05] sm:text-5xl md:text-[3.4rem]">
              {slide.title}
            </h1>
            <p className="mt-4 text-2xl font-semibold tracking-wide text-[#e8c84a] sm:text-3xl">
              {slide.offer}
            </p>
            <p className="mt-3 text-[0.68rem] font-medium tracking-[0.18em] text-white/85 uppercase">
              {slide.cats}
            </p>
            <div className="mt-8 flex justify-end">
              <Link
                to={slide.to}
                className="inline-flex items-center justify-center rounded-md bg-white px-9 py-3.5 text-[0.72rem] font-semibold tracking-[0.18em] text-[#1a1a1a] uppercase transition hover:bg-[#f7f5f3]"
              >
                {slide.cta}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`rounded-full transition ${
              i === index
                ? 'h-2.5 w-2.5 bg-white'
                : 'size-2 bg-white/45 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
