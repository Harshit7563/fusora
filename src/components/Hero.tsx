import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Slide =
  | {
      id: string
      kind: 'triptych'
      left: string
      right: string
      title: string
      line: string
      to: string
    }
  | {
      id: string
      kind: 'full'
      image: string
      position?: string
      title: string
      to: string
    }

const slides: Slide[] = [
  {
    id: 'kalyanam',
    kind: 'triptych',
    left: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    right:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    title: 'Kalyanam',
    line: 'Woven for moments that last forever.',
    to: '/category/women/sarees',
  },
  {
    id: 'banarasi',
    kind: 'full',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2400&q=85',
    position: 'object-[center_30%]',
    title: 'Banarasi Collection',
    to: '/category/women/sarees',
  },
  {
    id: 'jewels',
    kind: 'full',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2400&q=85',
    position: 'object-center',
    title: 'Jewellery Edit',
    to: '/category/jewelry-eyewear-watches',
  },
  {
    id: 'men',
    kind: 'full',
    image: '/heroes/hero-denim.jpg',
    position: 'object-[center_20%]',
    title: 'Men’s Collection',
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

  return (
    <section className="relative h-[min(88svh,860px)] min-h-[520px] overflow-hidden bg-[#5a3826]">
      <AnimatePresence mode="wait">
        {slide.kind === 'triptych' ? (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 grid md:grid-cols-[1fr_minmax(240px,28%)_1fr]"
          >
            <img
              src={slide.left}
              alt=""
              className="hidden h-full w-full object-cover object-[center_20%] md:block"
            />
            <div className="relative flex flex-col items-center justify-center bg-[#5a3826] px-6 py-16 text-center md:py-0">
              <img
                src={slide.left}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30 md:hidden"
              />
              <div className="relative z-[1]">
                <h1 className="font-serif text-5xl tracking-wide text-[#d48c45] sm:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-xs font-serif text-base italic text-white/90 sm:text-lg">
                  {slide.line}
                </p>
                <div className="mx-auto mt-5 size-5 text-white/80" aria-hidden>
                  ✦
                </div>
                <Link to={slide.to} className="btn-outline-light mt-8 inline-flex">
                  Shop Now
                </Link>
              </div>
            </div>
            <img
              src={slide.right}
              alt=""
              className="hidden h-full w-full object-cover object-[center_22%] md:block"
            />
          </motion.div>
        ) : (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt=""
              className={`h-full w-full object-cover ${slide.position || 'object-center'}`}
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
              <h1 className="font-serif text-4xl tracking-[0.08em] uppercase sm:text-5xl md:text-6xl">
                {slide.title}
              </h1>
              <div className="mt-5 h-px w-16 bg-white/70" />
              <Link to={slide.to} className="btn-outline-light mt-8 inline-flex">
                Shop Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-6 z-[2] flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-[2px] rounded-full transition ${
              i === index ? 'w-8 bg-white' : 'w-6 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
