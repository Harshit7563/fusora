import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

const reviews = [
  {
    name: 'Ananya M.',
    place: 'Jaipur',
    text: 'The saree fabric and finish felt premium. Packaging was neat and delivery was quick.',
  },
  {
    name: 'Riya S.',
    place: 'Mumbai',
    text: 'Exactly as shown in the photos. Soft fall, beautiful colour — will order again.',
  },
  {
    name: 'Neha K.',
    place: 'Pune',
    text: 'Great value for festive wear. Support team helped with size guidance on WhatsApp.',
  },
]

export function ReviewsSection() {
  return (
    <section className="bg-fusora-ivory px-3 py-14 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-bb-blue uppercase">
            Customers are saying
          </p>
          <h2 className="text-display mt-2 text-[2rem] text-bb-text sm:text-4xl">
            Loved across India
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-bb-text">
            <div className="flex gap-0.5 text-fusora-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium">4.84 ★</span>
            <span className="text-sm text-bb-muted">(1,572 reviews)</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="border border-bb-border bg-white px-5 py-6"
            >
              <div className="mb-3 flex gap-0.5 text-fusora-gold">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-bb-text">“{r.text}”</p>
              <footer className="mt-4 text-xs tracking-wide text-bb-muted uppercase">
                {r.name} · {r.place}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
