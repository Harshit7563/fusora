import denimforgeCategories from './denimforgeCategories.json'
import dyntraCategories from './dyntraCategories.json'

/** Apparel & Clothes subtypes */
export type ApparelSubtype = 'tshirts' | 'shirts' | 'sarees' | 'jeans' | 'dresses'

export const apparelSubtypes: {
  id: ApparelSubtype
  label: string
  blurb: string
  image: string
}[] = [
  {
    id: 'tshirts',
    label: 'T-shirts',
    blurb: 'Everyday tees — soft cotton, clean fits.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'shirts',
    label: 'Shirts',
    blurb: 'Casual & formal shirts for every occasion.',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sarees',
    label: 'Sarees',
    blurb: 'Silk, Banarasi, handloom and festive weaves.',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'jeans',
    label: 'Jeans',
    blurb: 'Men, women and kids — fits, washes and everyday denim.',
    image:
      'https://thedenimforge.com/uploads/products/1789985439763-lnhn91.webp',
  },
  {
    id: 'dresses',
    label: 'Dresses',
    blurb: 'A-line, fit & flare, wrap and maxi dresses for every day.',
    image: '/products/dresses/scarlet-maxi.jpg',
  },
]

export const denimCollections = (
  denimforgeCategories as Array<{
    slug: string
    name: string
    blurb: string
    image: string
  }>
).map((c) => ({
  id: c.slug,
  label: c.name,
  blurb: c.blurb,
  image: c.image,
}))

/** Dyntra fabric categories for saree filters */
export const dyntraFabricCategories = (
  dyntraCategories as Array<{
    slug: string
    name: string
    groupType: string
    image?: string | null
    sortOrder?: number
  }>
)
  .filter((c) => c.groupType === 'fabric')
  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  .map((c) => ({
    id: c.slug,
    label: c.name,
    image: c.image || undefined,
  }))

export const ALL_APPAREL_SUBTYPES: ApparelSubtype[] = [
  'tshirts',
  'shirts',
  'sarees',
  'jeans',
  'dresses',
]
