import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is the delivery time?',
    a: 'We usually dispatch orders within 24–48 hours. Delivery takes 3–7 business days depending on your location.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes, Cash on Delivery is available on selected pin codes across India.',
  },
  {
    q: 'How should I wash and care for the saree?',
    a: 'We recommend dry cleaning for the first wash. Follow the care instructions mentioned on the product page.',
  },
  {
    q: 'What is the fabric quality like?',
    a: 'We carefully select premium-quality fabrics to ensure comfort, durability, and an elegant look.',
  },
  {
    q: 'Will the product look exactly like the images?',
    a: 'We use actual product photographs. Slight colour variations may occur due to screen settings and lighting.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'You can reach us via email at Support@fusora.shop or through the Contact / Support page for any assistance.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section className="bg-white px-3 py-14 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-bb-blue uppercase">
            Help
          </p>
          <h2 className="text-display mt-2 text-[2rem] text-bb-text sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-bb-border border-y border-bb-border">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-bb-text sm:text-[0.95rem]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-bb-muted transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-4 text-sm leading-relaxed text-bb-muted">
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
