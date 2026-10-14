import type { CategoryId, Product } from './data'
import { uniqueImages } from './data'
import type { ApparelSubtype } from './data/apparel'

export type SizeChart = {
  title: string
  unit: string
  headers: string[]
  rows: string[][]
  note: string
}

export type ProductReview = {
  id: string
  name: string
  rating: number
  date: string
  title: string
  text: string
  verified: boolean
  helpful: number
}

export type ProductDetails = {
  sku: string
  rating: number
  reviewCount: number
  model: string
  color: string
  highlights: string[]
  specs: { label: string; value: string }[]
  overview: string
  gallery: string[]
  protection: string[]
  sizes: string[]
  sizeChart: SizeChart | null
  reviews: ProductReview[]
  ratingBreakdown: number[]
  care: string[]
  material: string
}

type CategoryMeta = {
  highlights: string[]
  specs: { label: string; value: string }[]
  overview: string
}

const defaultMeta: CategoryMeta = {
  highlights: [
    'Quality-checked marketplace pick',
    'Competitive pricing vs MRP',
    'Fast delivery to your Fusora hub',
    'Easy returns on eligible items',
  ],
  specs: [
    { label: 'Condition', value: 'New' },
    { label: 'Fulfilment', value: 'Fusora hub / doorstep' },
    { label: 'Returns', value: 'Eligible items' },
    { label: 'Support', value: 'shopsupportfusora@gmail.com' },
    { label: 'Warranty', value: 'Brand warranty where applicable' },
  ],
  overview:
    'A curated catalog item from Fusora marketplace — reliable quality, clear pricing, and delivery you can trust.',
}

const byCategory: Partial<Record<CategoryId, CategoryMeta>> = {
  'consumer-electronics': {
    highlights: [
      'Latest gadgets and everyday tech',
      'Brand-authorized quality',
      'Fast charging / connectivity ready',
      'Warranty support where applicable',
    ],
    specs: [
      { label: 'Category', value: 'Consumer Electronics' },
      { label: 'Power', value: 'As per model' },
      { label: 'Connectivity', value: 'Wireless / wired options' },
      { label: 'Warranty', value: 'Brand limited warranty' },
    ],
    overview:
      'Phones, audio, computing and entertainment tech for home and work.',
  },
  'home-appliances': {
    highlights: [
      'Energy-efficient home performance',
      'Family-ready capacity',
      'Modern finishes',
      'Easy install options',
    ],
    specs: [
      { label: 'Category', value: 'Home Appliances' },
      { label: 'Energy', value: 'Efficient rated models' },
      { label: 'Install', value: 'Standard / assisted' },
      { label: 'Warranty', value: '1-year+ brand cover' },
    ],
    overview: 'Kitchen and home appliances built for daily Indian households.',
  },
  'apparel-accessories': {
    highlights: [
      'Everyday apparel essentials',
      'Trusted clothing brands',
      'Comfort-first fabrics',
      'Great value packs',
    ],
    specs: [
      { label: 'Category', value: 'Apparel & Accessories' },
      { label: 'Care', value: 'See product label' },
      { label: 'Fit', value: 'Standard sizing' },
      { label: 'Return', value: 'Eligible unused items' },
    ],
    overview: 'Apparel and accessories for daily wear and essentials.',
  },
  'luggage-bags-cases': {
    highlights: [
      'Travel-ready bags and organisers',
      'Durable materials',
      'Cabin and check-in options',
      'Smooth zippers and handles',
    ],
    specs: [
      { label: 'Category', value: 'Luggage, Bags & Cases' },
      { label: 'Use', value: 'Travel / daily carry' },
      { label: 'Material', value: 'Polyester / fabric blends' },
      { label: 'Warranty', value: 'Brand warranty where listed' },
    ],
    overview: 'Luggage, duffels, organisers and cases for every trip.',
  },
  'jewelry-eyewear-watches': {
    highlights: [
      'Statement jewellery pieces',
      'Gift-ready packaging styles',
      'Plated and stone accents',
      'Adjustable fits on many SKUs',
    ],
    specs: [
      { label: 'Category', value: 'Jewelry, Eyewear & Watches' },
      { label: 'Finish', value: 'As pictured' },
      { label: 'Occasion', value: 'Daily / festive' },
      { label: 'Care', value: 'Wipe clean; avoid water soak' },
    ],
    overview: 'Jewellery and wearable accessories to complete any look.',
  },
  'parents-kids-toys': {
    highlights: [
      'Fun for kids and families',
      'Age-appropriate picks',
      'Durable play materials',
      'Gift-friendly options',
    ],
    specs: [
      { label: 'Category', value: 'Parents, Kids & Toys' },
      { label: 'Age', value: 'See product details' },
      { label: 'Safety', value: 'Use under adult guidance' },
      { label: 'Warranty', value: 'Brand terms apply' },
    ],
    overview: 'Toys, kids gear and parent essentials for growing families.',
  },
}

type JeansAudience = 'men' | 'women' | 'kids'

function jeansAudience(product: Product): JeansAudience {
  const blob = [
    product.collection,
    product.categorySlug,
    product.categoryName,
    product.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  if (/kid|boy|girl|child|infant/.test(blob)) return 'kids'
  if (/women|womens|woman|ladies|girl|female/.test(blob)) return 'women'
  if (/men|mens|man|male/.test(blob)) return 'men'
  // Default denim cargo styling often women's in this catalog; prefer women for "cargo" mid sizes
  return 'women'
}

function inch(n: number, decimals = 0): string {
  const f = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n))
  return f.replace(/\.0$/, '')
}

function range(a: number, b: number): string {
  return `${inch(a)}–${inch(b)}`
}

/** Adult jeans chart row from waist label (e.g. "32") */
function adultJeansRow(waistLabel: string, audience: 'men' | 'women'): string[] {
  const w = Number(waistLabel)
  if (!Number.isFinite(w) || w < 22 || w > 50) {
    return [waistLabel, '—', '—', '—', '—']
  }
  if (audience === 'women') {
    const hipLo = w + 8
    const hipHi = w + 10
    const inseam = w <= 30 ? 30 : w <= 34 ? 31 : 32
    const thigh = 20 + (w - 26) * 0.45
    const rise = w <= 30 ? 9.5 : w <= 34 ? 10 : w <= 38 ? 10.5 : 11
    return [
      waistLabel,
      range(hipLo, hipHi),
      inch(inseam),
      inch(thigh, 1),
      inch(rise, 1),
    ]
  }
  // men
  const hipLo = w + 6
  const hipHi = w + 8
  const inseam = w <= 32 ? 30 : w <= 36 ? 31 : 32
  const thigh = 21 + (w - 28) * 0.5
  const rise = w <= 30 ? 10 : w <= 34 ? 10.5 : w <= 38 ? 11 : 11.5
  return [
    waistLabel,
    range(hipLo, hipHi),
    inch(inseam),
    inch(thigh, 1),
    inch(rise, 1),
  ]
}

/** Kids jean sizes like 4, 6, 8… (US kids waist / age band) */
function kidsJeansRow(sizeLabel: string): string[] {
  const n = Number(sizeLabel)
  if (!Number.isFinite(n)) {
    return [sizeLabel, '—', '—', '—', '—']
  }
  const age =
    n <= 4 ? '3–4 yrs' : n <= 6 ? '5–6 yrs' : n <= 8 ? '7–8 yrs' : n <= 10 ? '9–10 yrs' : n <= 12 ? '11–12 yrs' : '13–14 yrs'
  const waist = 20 + (n - 4) * 1.1
  const hip = waist + 5
  const heightLo = 98 + (n - 4) * 6
  const heightHi = heightLo + 6
  return [
    sizeLabel,
    age,
    `${inch(waist, 1)}"`,
    `${inch(hip, 1)}"`,
    `${inch(heightLo)}–${inch(heightHi)} cm`,
  ]
}

const TOPS_MASTER: Record<string, string[]> = {
  XS: ['XS', '32–34', '14.5', '26', '7.5'],
  S: ['S', '36–38', '15.5', '27', '8'],
  M: ['M', '38–40', '16.5', '28', '8.5'],
  L: ['L', '40–42', '17.5', '29', '9'],
  XL: ['XL', '42–44', '18.5', '30', '9.5'],
  XXL: ['XXL', '44–46', '19.5', '31', '10'],
  '3XL': ['3XL', '46–48', '20.5', '32', '10.5'],
  '4XL': ['4XL', '48–50', '21.5', '33', '11'],
}

const KIDS_AGE_MASTER: Record<string, string[]> = {
  '2–3Y': ['2–3Y', '2–3 yrs', '53', '51', '92–98'],
  '4–5Y': ['4–5Y', '4–5 yrs', '58', '54', '104–110'],
  '6–7Y': ['6–7Y', '6–7 yrs', '63', '57', '116–122'],
  '8–9Y': ['8–9Y', '8–9 yrs', '68', '60', '128–134'],
  '10–12Y': ['10–12Y', '10–12 yrs', '74', '64', '140–152'],
}

function filterOrBuildRows(
  sizes: string[],
  buildRow: (size: string) => string[] | undefined,
): string[][] {
  return sizes.map((size) => buildRow(size) ?? [size, '—', '—', '—', '—'])
}

function chartForJeans(product: Product, sizes: string[]): SizeChart {
  const audience = jeansAudience(product)
  const fit = product.fit ? `${product.fit} fit` : 'Regular fit'
  if (audience === 'kids') {
    return {
      title: `${product.categoryName || 'Kids jeans'} size chart`,
      unit: 'size / inches & cm',
      headers: ['Size', 'Age', 'Waist', 'Hip', 'Height'],
      rows: filterOrBuildRows(sizes, kidsJeansRow),
      note: `Chart for this ${fit.toLowerCase()} kids jean. If between sizes, choose the larger one.`,
    }
  }
  const who = audience === 'women' ? "Women's" : "Men's"
  const label =
    product.categoryName?.trim() ||
    `${who} jeans`
  return {
    title: `${label} size chart`,
    unit: 'inches',
    headers: ['Waist', 'Hip', 'Inseam', 'Thigh', 'Rise'],
    rows: filterOrBuildRows(sizes, (s) => adultJeansRow(s, audience)),
    note: `Measurements for this product’s available sizes (${sizes.join(', ')}). ${fit}. Waist is flat band × 2. Stretch denim may feel snug at first — if between sizes, size up.`,
  }
}

function chartForTops(product: Product, sizes: string[]): SizeChart {
  const kind = /kurta/.test(product.name.toLowerCase())
    ? 'Kurta'
    : /hoodie/.test(product.name.toLowerCase())
      ? 'Hoodie'
      : product.subtype === 'shirts'
        ? 'Shirt'
        : product.subtype === 'tshirts'
          ? 'T-shirt'
          : 'Top'
  return {
    title: `${kind} size chart`,
    unit: 'inches',
    headers: ['Size', 'Chest', 'Shoulder', 'Length', 'Sleeve'],
    rows: filterOrBuildRows(sizes, (s) => {
      const key = s.toUpperCase().replace(/\s+/g, '')
      return TOPS_MASTER[key] ?? TOPS_MASTER[s]
    }),
    note: `Only sizes stocked for this ${kind.toLowerCase()}: ${sizes.join(', ')}. Measure chest at the fullest point.`,
  }
}

function chartForSaree(product: Product): SizeChart {
  const fabricHint =
    product.fabric ||
    (/silk/i.test(product.name)
      ? 'Silk'
      : /cotton/i.test(product.name)
        ? 'Cotton'
        : /chiffon|georgette/i.test(product.name)
          ? 'Chiffon / georgette'
          : 'As listed')
  const short =
    product.name.length > 48 ? `${product.name.slice(0, 46).trim()}…` : product.name
  return {
    title: `${short} — size chart`,
    unit: 'metres / inches',
    headers: ['Piece', 'Length', 'Width', 'Blouse', 'Fit tip'],
    rows: [
      ['Saree', '5.5 m', '44–46"', 'Unstitched', 'Free size drape'],
      ['Blouse fabric', '0.8 m', '—', 'S–XL', 'Stitch to your measure'],
      ['Petticoat', 'Free', '—', 'S–XXL', 'Drawstring adjustable'],
    ],
    note: `${fabricHint}. Saree is free size. Blouse piece is unstitched — share bust/waist with your tailor.`,
  }
}

function chartForKidsWear(sizes: string[]): SizeChart {
  return {
    title: 'Kids wear size chart',
    unit: 'age / cm',
    headers: ['Size', 'Age', 'Chest', 'Waist', 'Height'],
    rows: filterOrBuildRows(sizes, (s) => KIDS_AGE_MASTER[s]),
    note: `Available sizes for this product: ${sizes.join(', ')}. If between sizes, choose the larger one.`,
  }
}

function chartForJewellery(): SizeChart {
  return {
    title: 'Jewellery size guide',
    unit: 'cm / adjustable',
    headers: ['Type', 'Size', 'Length', 'Width', 'Note'],
    rows: [
      ['Necklace', 'Standard', '40–45', '—', 'Extender on many SKUs'],
      ['Bracelet', 'Adjustable', '16–20', '—', 'Open cuff or chain'],
      ['Earrings', 'One size', '—', '—', 'Lightweight daily wear'],
      ['Ring', 'Adjustable', '—', '—', 'Open band where listed'],
    ],
    note: 'Avoid water and perfume on plated pieces. Wipe with a soft dry cloth.',
  }
}

function chartForLuggage(product: Product): SizeChart {
  const name = product.name.toLowerCase()
  const rows: string[][] = []
  if (/cabin|trolley|carry/.test(name)) {
    rows.push(['Cabin', '55', '35', '25', '35–45 L'])
  }
  if (/medium|check.?in|suitcase|luggage/.test(name) || rows.length === 0) {
    rows.push(['Medium', '65', '42', '28', '55–70 L'])
  }
  if (/large|check.?in|xl|hard/.test(name)) {
    rows.push(['Check-in', '75', '48', '30', '80–100 L'])
  }
  if (/duffel|duffle|gym|tote|backpack|pouch|sling/.test(name)) {
    rows.push(['Bag / duffel', '—', '—', '—', 'As listed on product'])
  }
  return {
    title: `${product.name.split(/[-–|]/)[0]?.trim().slice(0, 40) || 'Bag'} size guide`,
    unit: 'cm / liters',
    headers: ['Type', 'Height', 'Width', 'Depth', 'Capacity'],
    rows,
    note: 'Airline cabin limits vary — check your carrier before travel.',
  }
}

/** Build a size chart that only includes this product’s available sizes. */
function buildProductSizeChart(
  product: Product,
  sizes: string[],
  kind:
    | 'jeans'
    | 'tops'
    | 'saree'
    | 'kids'
    | 'jewellery'
    | 'luggage'
    | 'none',
): SizeChart | null {
  if (kind === 'none') return null
  if (kind === 'jeans') return chartForJeans(product, sizes)
  if (kind === 'tops') return chartForTops(product, sizes)
  if (kind === 'saree') return chartForSaree(product)
  if (kind === 'kids') return chartForKidsWear(sizes)
  if (kind === 'jewellery') return chartForJewellery()
  if (kind === 'luggage') return chartForLuggage(product)
  return null
}

function hashSeed(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function pickSizeProfile(product: Product): {
  sizes: string[]
  chart: SizeChart | null
  material: string
  care: string[]
} {
  const subtype = product.subtype as ApparelSubtype | undefined
  const name = product.name.toLowerCase()
  const audience = jeansAudience(product)

  if (subtype === 'jeans' || /jean|denim|trouser|jogger|cargo pant/.test(name)) {
    const defaultAdult = ['28', '30', '32', '34', '36', '38', '40', '42']
    const defaultKids = ['4', '6', '8', '10', '12', '14']
    const sizes =
      product.sizes && product.sizes.length > 0
        ? product.sizes
        : audience === 'kids'
          ? defaultKids
          : defaultAdult
    return {
      sizes,
      chart: buildProductSizeChart(product, sizes, 'jeans'),
      material: product.fabric || 'Cotton denim blend',
      care: [
        'Machine wash cold, inside out',
        'Do not bleach',
        'Tumble dry low or hang dry',
        'Iron on reverse if needed',
      ],
    }
  }
  if (subtype === 'sarees' || /saree|sari|blouse|petticoat/.test(name)) {
    const sizes = ['Free Size']
    return {
      sizes,
      chart: buildProductSizeChart(product, sizes, 'saree'),
      material: product.fabric || 'Silk / chiffon / georgette as listed',
      care: [
        'Dry clean preferred for silk',
        'Hand wash gentle for chiffon',
        'Store folded with tissue',
        'Avoid direct sunlight',
      ],
    }
  }
  if (subtype === 'tshirts' || subtype === 'shirts' || /t-shirt|tee|shirt|kurta|hoodie|top/.test(name)) {
    const sizes =
      product.sizes && product.sizes.length > 0
        ? product.sizes
        : ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    return {
      sizes,
      chart: buildProductSizeChart(product, sizes, 'tops'),
      material: product.fabric || 'Cotton / blend as listed',
      care: [
        'Machine wash cold',
        'Wash dark colours separately',
        'Do not wring printed areas',
        'Iron on low heat',
      ],
    }
  }
  if (/kid|infant|baby|boy|girl|romper/.test(name) || product.tab === 'parents-kids-toys') {
    if (/toy|lego|game/.test(name)) {
      return { sizes: [], chart: null, material: 'As pictured', care: ['Use under adult guidance'] }
    }
    const sizes =
      product.sizes && product.sizes.length > 0
        ? product.sizes
        : ['2–3Y', '4–5Y', '6–7Y', '8–9Y', '10–12Y']
    // Numeric kids jean-like sizes
    if (sizes.every((s) => /^\d+$/.test(s))) {
      return {
        sizes,
        chart: buildProductSizeChart(product, sizes, 'jeans'),
        material: product.fabric || 'Soft cotton / blend',
        care: ['Gentle machine wash', 'Do not bleach', 'Line dry'],
      }
    }
    return {
      sizes,
      chart: buildProductSizeChart(product, sizes, 'kids'),
      material: product.fabric || 'Soft cotton / blend',
      care: ['Gentle machine wash', 'Do not bleach', 'Line dry'],
    }
  }
  if (product.tab === 'jewelry-eyewear-watches' || /jewel|earring|necklace|bracelet|ring/.test(name)) {
    const sizes = ['One Size']
    return {
      sizes,
      chart: buildProductSizeChart(product, sizes, 'jewellery'),
      material: 'Plated metal / stones as pictured',
      care: ['Keep dry', 'Wipe with soft cloth', 'Store in pouch'],
    }
  }
  if (product.tab === 'luggage-bags-cases' || /bag|luggage|duffel|suitcase|pouch/.test(name)) {
    const sizes = ['Standard']
    return {
      sizes,
      chart: buildProductSizeChart(product, sizes, 'luggage'),
      material: 'Polyester / hard shell as listed',
      care: ['Wipe clean', 'Do not overload', 'Lock zippers before travel'],
    }
  }

  // Fallback: if product lists sizes, still show a matching chart
  if (product.sizes && product.sizes.length > 0) {
    const sizes = product.sizes
    const alpha = sizes.every((s) => /^(XS|S|M|L|XL|XXL|3XL|4XL)$/i.test(s.trim()))
    const waist = sizes.every((s) => /^\d{2}$/.test(s.trim()))
    const kidsNum = sizes.every((s) => /^\d{1,2}$/.test(s.trim()) && Number(s) <= 16)
    if (alpha) {
      return {
        sizes,
        chart: buildProductSizeChart(product, sizes, 'tops'),
        material: product.fabric || 'As per product description',
        care: ['Follow brand care label'],
      }
    }
    if (waist || kidsNum) {
      return {
        sizes,
        chart: buildProductSizeChart(product, sizes, 'jeans'),
        material: product.fabric || 'As per product description',
        care: ['Follow brand care label'],
      }
    }
  }

  return {
    sizes: [],
    chart: null,
    material: 'As per product description',
    care: ['Follow brand care label', 'Keep away from moisture where advised'],
  }
}

const REVIEW_POOL: Omit<ProductReview, 'id' | 'helpful' | 'date'>[] = [
  {
    name: 'Aarav K.',
    rating: 5,
    title: 'Exactly as shown',
    text: 'Fabric feel is premium for the price. Pickup from my Fusora hub was ready in under an hour.',
    verified: true,
  },
  {
    name: 'Meera S.',
    rating: 5,
    title: 'True to size',
    text: 'Followed the size chart and the fit is perfect. Packaging was neat and colour matches the photos.',
    verified: true,
  },
  {
    name: 'Rohan P.',
    rating: 4,
    title: 'Great everyday pick',
    text: 'Solid build and honest deal pricing. Would buy again — delivery was on time.',
    verified: true,
  },
  {
    name: 'Ananya R.',
    rating: 5,
    title: 'Worth the deal',
    text: 'Looked even better in hand. Soft finish and stitching is clean. Hub staff were helpful.',
    verified: true,
  },
  {
    name: 'Kabir D.',
    rating: 4,
    title: 'Good quality',
    text: 'Slightly snug at first wash advice helped. After that it sits well. Happy with the purchase.',
    verified: false,
  },
  {
    name: 'Ishita V.',
    rating: 5,
    title: 'Repeat customer',
    text: 'Second order from Fusora. Consistent quality and clear returns policy gave me confidence.',
    verified: true,
  },
  {
    name: 'Dev M.',
    rating: 3,
    title: 'Decent for the price',
    text: 'Colour is a shade darker than the screen, but still wearable. Size chart was accurate.',
    verified: true,
  },
  {
    name: 'Sana F.',
    rating: 5,
    title: 'Gift-ready',
    text: 'Bought as a gift — arrived well packed. Recipient loved the fit. Will order more colours.',
    verified: true,
  },
]

function buildReviews(product: Product, rating: number, count: number): {
  reviews: ProductReview[]
  breakdown: number[]
} {
  const seed = hashSeed(product.id)
  const n = 4 + (seed % 3)
  const reviews: ProductReview[] = []
  for (let i = 0; i < n; i++) {
    const base = REVIEW_POOL[(seed + i * 3) % REVIEW_POOL.length]
    const day = 2 + ((seed + i * 7) % 26)
    const month = 1 + ((seed + i) % 9)
    reviews.push({
      ...base,
      id: `${product.id}-r${i}`,
      rating: i === 0 ? Math.round(rating) : base.rating,
      date: `2026-0${month}-${String(day).padStart(2, '0')}`,
      helpful: 2 + ((seed + i * 5) % 40),
    })
  }

  // Approximate star breakdown from overall rating + count
  const breakdown = [0, 0, 0, 0, 0]
  const r = Math.min(5, Math.max(1, rating))
  breakdown[4] = Math.round(count * (r >= 4.5 ? 0.62 : 0.48))
  breakdown[3] = Math.round(count * (r >= 4 ? 0.22 : 0.28))
  breakdown[2] = Math.round(count * 0.1)
  breakdown[1] = Math.round(count * 0.05)
  breakdown[0] = Math.max(0, count - breakdown.reduce((a, b) => a + b, 0))
  return { reviews, breakdown }
}

export function getProductDetails(product: Product): ProductDetails {
  const meta = byCategory[product.tab] ?? defaultMeta
  const colorMatch = product.name.match(
    /(Silver|Black|White|Grey|Gray|Nude|Yellow|Red|Blue|Green|Titanium|Natural|Carbon|Maroon|Pink|Navy|Ivory|Cream|Olive|Beige|Brown|Purple|Orange)[^,]*/i,
  )
  const profile = pickSizeProfile(product)
  const rating = product.topDeal ? 4.7 : 4.2 + (hashSeed(product.id) % 6) / 10
  const reviewCount = 48 + (hashSeed(product.id) % 220) + product.rank * 3
  const { reviews, breakdown } = buildReviews(product, rating, reviewCount)

  const specs = [
    ...meta.specs,
    { label: 'Material', value: profile.material },
    ...(profile.sizes.length
      ? [{ label: 'Available sizes', value: profile.sizes.join(', ') }]
      : []),
    { label: 'Colour', value: colorMatch?.[0]?.trim() || 'As pictured' },
  ]

  return {
    sku: `FUS-${product.id.toUpperCase()}-${product.brand.slice(0, 3).toUpperCase()}`,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    model: `${product.brand} ${product.id.toUpperCase()}`,
    color: colorMatch?.[0]?.trim() || 'Standard',
    highlights: meta.highlights,
    specs,
    overview: `${product.brand} — ${product.description || meta.overview}`,
    gallery: uniqueImages(product.image, product.images),
    protection: [
      'Fusora Purchase Protection',
      'Easy returns on eligible items',
      'Hub pickup support',
    ],
    sizes: profile.sizes,
    sizeChart: profile.chart,
    reviews,
    ratingBreakdown: breakdown,
    care: profile.care,
    material: profile.material,
  }
}
