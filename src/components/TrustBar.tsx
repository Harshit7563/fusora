const items = [
  {
    title: 'COD Available',
    line: 'Cash on Delivery on eligible orders',
  },
  {
    title: 'Pan-India Delivery',
    line: 'Dispatch in 24–48 hours',
  },
  {
    title: 'Monday–Saturday',
    line: 'Expert support, 10:30 AM–7:00 PM',
  },
  {
    title: 'Secure Payments',
    line: 'Safe checkout on every order',
  },
]

export function TrustBar() {
  return (
    <section className="border-b border-bb-border bg-white px-3 py-10 sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map(({ title, line }) => (
          <div key={title} className="text-center">
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-bb-text uppercase">
              {title}
            </p>
            <p className="mt-1.5 text-xs text-bb-muted">{line}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
