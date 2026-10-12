import type { CategoryId } from '../categories'
import denimforgeCategories from './denimforgeCategories.json'
import dyntraCategories from './dyntraCategories.json'

/** Apparel & Clothes subtypes */
export type ApparelSubtype = 'tshirts' | 'shirts' | 'sarees' | 'jeans'

type ApparelProduct = {
  id: string
  rank: number
  name: string
  price: number
  was: number
  topDeal?: boolean
  tab: CategoryId
  subtype: ApparelSubtype
  brand: string
  image: string
}

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
]

export const apparelCoreProducts: ApparelProduct[] = [
  // ——— T-shirts ———
  {
    id: 'ts1',
    rank: 1,
    name: 'Fusora Classic Cotton Crew Neck T-shirt - White',
    price: 499,
    was: 799,
    topDeal: true,
    tab: 'apparel-accessories',
    subtype: 'tshirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ts2',
    rank: 2,
    name: 'Fusora Oversized Graphic Print T-shirt - Black',
    price: 699,
    was: 1199,
    topDeal: true,
    tab: 'apparel-accessories',
    subtype: 'tshirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ts3',
    rank: 3,
    name: 'Fusora Slim Fit Polo T-shirt - Navy',
    price: 899,
    was: 1499,
    tab: 'apparel-accessories',
    subtype: 'tshirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ts4',
    rank: 4,
    name: 'Fusora Soft Touch V-Neck T-shirt - Grey Melange',
    price: 549,
    was: 899,
    tab: 'apparel-accessories',
    subtype: 'tshirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ts5',
    rank: 5,
    name: 'Fusora Essential Pack of 3 Solid T-shirts',
    price: 1299,
    was: 2199,
    topDeal: true,
    tab: 'apparel-accessories',
    subtype: 'tshirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ts6',
    rank: 6,
    name: 'Fusora Drop Shoulder Cotton T-shirt - Olive',
    price: 649,
    was: 999,
    tab: 'apparel-accessories',
    subtype: 'tshirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842fbf?auto=format&fit=crop&w=800&q=80',
  },
  // ——— Shirts ———
  {
    id: 'sh1',
    rank: 1,
    name: 'Fusora Oxford Formal Shirt - Sky Blue',
    price: 1299,
    was: 1999,
    topDeal: true,
    tab: 'apparel-accessories',
    subtype: 'shirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sh2',
    rank: 2,
    name: 'Fusora Linen Blend Casual Shirt - White',
    price: 1499,
    was: 2499,
    topDeal: true,
    tab: 'apparel-accessories',
    subtype: 'shirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sh3',
    rank: 3,
    name: 'Fusora Checked Casual Shirt - Olive Multi',
    price: 1199,
    was: 1899,
    tab: 'apparel-accessories',
    subtype: 'shirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sh4',
    rank: 4,
    name: 'Fusora Slim Fit Formal Shirt - Black',
    price: 1399,
    was: 2299,
    tab: 'apparel-accessories',
    subtype: 'shirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sh5',
    rank: 5,
    name: 'Fusora Mandarin Collar Shirt - Beige',
    price: 1099,
    was: 1799,
    topDeal: true,
    tab: 'apparel-accessories',
    subtype: 'shirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sh6',
    rank: 6,
    name: 'Fusora Cubano Resort Shirt - Teal Print',
    price: 1599,
    was: 2599,
    tab: 'apparel-accessories',
    subtype: 'shirts',
    brand: 'Fusora',
    image:
      'https://images.unsplash.com/photo-1467043232984-4adf1429cd94?auto=format&fit=crop&w=800&q=80',
  },
]
