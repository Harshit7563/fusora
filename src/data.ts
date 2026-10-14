import {
  dealTabs,
  shopCategories,
  type CategoryId,
  type DealTab,
} from './categories'
import dyntraSarees from './data/dyntraSarees.json'
import modcartProducts from './data/modcartProducts.json'
import denimforgeProducts from './data/denimforgeProducts.json'
import {
  apparelCoreProducts,
  type ApparelSubtype,
} from './data/apparel'

export type { CategoryId, DealTab }
export { dealTabs, shopCategories }
export type { ApparelSubtype }

export type ProductGender = 'men' | 'women' | 'unisex'

export type Product = {
  id: string
  rank: number
  name: string
  price: number
  was: number
  topDeal?: boolean
  tab: CategoryId
  /** Apparel & Clothes only */
  subtype?: ApparelSubtype
  /** men | women | unisex — used for Men/Women category pages */
  gender?: ProductGender
  /** Source collection slug (e.g. mens-jeans, silk-sarees) */
  collection?: string
  categoryName?: string
  categorySlug?: string
  image: string
  /** Extra gallery photos — duplicates are stripped at display time */
  images?: string[]
  brand: string
  description?: string
  sizes?: string[]
  fit?: string
  wash?: string
  fabric?: string
  sku?: string
  source?: string
}

/** Strip supplier brand prefixes from product titles (Dyntra / Denim Forge). */
export function cleanSupplierName(name: string): string {
  let s = String(name || '')
  s = s
    .replace(/\bthe\s+denim\s+forge\b/gi, '')
    .replace(/\bdenim\s+forge\b/gi, '')
    .replace(/\bdenim\s+foege\b/gi, '')
    .replace(/denim\s*forge/gi, '')
    .replace(/\bdyntra\b/gi, '')
    .replace(/dyntra/gi, '')
    .replace(/\bMa\s+terial\b/gi, 'Material')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s\-–—:,.]+|[\s\-–—:,.]+$/g, '')
    .trim()
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
  return s.replace(/\s{2,}/g, ' ').trim()
}

function fusoraBrand(raw: unknown, fallback = 'Fusora'): string {
  const b = String(raw || fallback)
  if (/dyntra|denim\s*forge/i.test(b)) return 'Fusora'
  return b || 'Fusora'
}

/** Keep order, drop exact duplicate URLs (and empty). */
export function uniqueImages(...groups: Array<string | string[] | undefined>): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const group of groups) {
    const list = Array.isArray(group) ? group : group ? [group] : []
    for (const raw of list) {
      const url = String(raw || '').trim()
      if (!url || seen.has(url)) continue
      seen.add(url)
      out.push(url)
    }
  }
  return out
}

export type CartItem = Product & { qty: number; selectedSize?: string }

const baseProducts: Product[] = [
  // ——— Laptops ———
  {
    id: 'l1',
    rank: 1,
    name: 'Apple - MacBook Air 13" M3 Chip - 8GB Memory - 256GB SSD - Midnight',
    price: 999.0,
    was: 1099.0,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l2',
    rank: 2,
    name: 'HP - 15.6" Full HD Touchscreen Laptop - AMD Ryzen 7 - 16GB - 512GB SSD - Natural Silver',
    price: 549.99,
    was: 699.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'HP',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l3',
    rank: 3,
    name: 'Dell - XPS 13 Plus - 13.4" OLED Touch - Intel Core Ultra 7 - 16GB - 512GB SSD',
    price: 1249.99,
    was: 1499.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Dell',
    image:
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l4',
    rank: 4,
    name: 'Lenovo - IdeaPad Slim 5 - 14" 2K - AMD Ryzen 5 - 16GB - 512GB SSD - Cloud Grey',
    price: 629.99,
    was: 799.99,
    tab: 'consumer-electronics',
    brand: 'Lenovo',
    image:
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l5',
    rank: 5,
    name: 'ASUS - VivoBook 16 - 16" FHD - Intel Core i5 - 16GB - 512GB SSD - Quiet Blue',
    price: 499.99,
    was: 649.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'ASUS',
    image:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac882e75?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l6',
    rank: 6,
    name: 'Microsoft - Surface Laptop 6 - 13.5" Touch - Intel Core Ultra 5 - 16GB - 512GB',
    price: 1099.99,
    was: 1299.99,
    tab: 'consumer-electronics',
    brand: 'Microsoft',
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l7',
    rank: 7,
    name: 'Acer - Aspire 5 - 15.6" FHD - Intel Core i7 - 16GB - 1TB SSD - Silver',
    price: 679.99,
    was: 849.99,
    tab: 'consumer-electronics',
    brand: 'Acer',
    image:
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'l8',
    rank: 8,
    name: 'Apple - MacBook Pro 14" M3 Pro - 18GB Memory - 512GB SSD - Space Black',
    price: 1999.0,
    was: 1999.0,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
  },

  // ——— Gaming ———
  {
    id: 'g1',
    rank: 1,
    name: 'ASUS - ROG Strix G16 Gaming Laptop - Intel Core i7 - RTX 4060 - 16GB - 1TB',
    price: 1199.99,
    was: 1499.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'ASUS',
    image:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g2',
    rank: 2,
    name: 'Logitech - G Pro X Superlight 2 Wireless Gaming Mouse - Black',
    price: 129.99,
    was: 159.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Logitech',
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g3',
    rank: 3,
    name: 'Razer - BlackWidow V4 Mechanical Gaming Keyboard - Green Switch',
    price: 169.99,
    was: 229.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Razer',
    image:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g4',
    rank: 4,
    name: 'NVIDIA - GeForce RTX 4070 Super Founders Edition Graphics Card',
    price: 599.99,
    was: 699.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'NVIDIA',
    image:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g5',
    rank: 5,
    name: 'SteelSeries - Arctis Nova Pro Wireless Gaming Headset - Black',
    price: 279.99,
    was: 349.99,
    tab: 'consumer-electronics',
    brand: 'SteelSeries',
    image:
      'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g6',
    rank: 6,
    name: 'Corsair - K70 RGB PRO Mechanical Keyboard - Cherry MX Red',
    price: 149.99,
    was: 179.99,
    tab: 'consumer-electronics',
    brand: 'Corsair',
    image:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g7',
    rank: 7,
    name: 'HyperX - Cloud III Wired Gaming Headset - Black/Red',
    price: 99.99,
    was: 129.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'HyperX',
    image:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g8',
    rank: 8,
    name: 'MSI - MAG Infinite S3 Gaming Desktop - RTX 4060 - 16GB - 1TB SSD',
    price: 999.99,
    was: 1299.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'MSI',
    image:
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
  },

  // ——— Appliances / TVs ———
  {
    id: 'a1',
    rank: 1,
    name: 'Samsung - 65" Class S90D OLED 4K Smart TV (2024)',
    price: 1599.99,
    was: 2299.99,
    topDeal: true,
    tab: 'home-appliances',
    brand: 'Samsung',
    image:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a2',
    rank: 2,
    name: 'LG - 55" Class C4 OLED evo 4K Smart TV (2024)',
    price: 1199.99,
    was: 1699.99,
    topDeal: true,
    tab: 'home-appliances',
    brand: 'LG',
    image:
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a3',
    rank: 3,
    name: 'Samsung - 27 cu. ft. French Door Refrigerator - Fingerprint Resistant Stainless',
    price: 1499.99,
    was: 2299.99,
    topDeal: true,
    tab: 'home-appliances',
    brand: 'Samsung',
    image:
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a4',
    rank: 4,
    name: 'LG - 5.0 Cu. Ft. Smart Front Load Washer with AI DD - White',
    price: 799.99,
    was: 1099.99,
    tab: 'home-appliances',
    brand: 'LG',
    image:
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a5',
    rank: 5,
    name: 'Sony - 65" Class BRAVIA 7 Mini-LED 4K HDR Smart Google TV',
    price: 1799.99,
    was: 2199.99,
    tab: 'home-appliances',
    brand: 'Sony',
    image:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a6',
    rank: 6,
    name: 'Dyson - V15 Detect Absolute Cordless Vacuum - Yellow/Nickel',
    price: 649.99,
    was: 749.99,
    topDeal: true,
    tab: 'home-appliances',
    brand: 'Dyson',
    image:
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a7',
    rank: 7,
    name: 'Instant Pot - Duo Plus 9-in-1 Electric Pressure Cooker - 6 Quart',
    price: 99.99,
    was: 129.99,
    topDeal: true,
    tab: 'home-appliances',
    brand: 'Instant Pot',
    image:
      'https://images.unsplash.com/photo-1585515320310-259814833e87?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'a8',
    rank: 8,
    name: 'Ninja - Foodi Dual Zone Air Fryer - 8 Quart - Black',
    price: 149.99,
    was: 199.99,
    tab: 'home-appliances',
    brand: 'Ninja',
    image:
      'https://images.unsplash.com/photo-1585515320310-259814833e87?auto=format&fit=crop&w=800&q=80',
  },

  // ——— Headphones / Audio ———
  {
    id: 'h1',
    rank: 1,
    name: 'Sony - WH-1000XM5 Wireless Noise Canceling Over-Ear Headphones - Black',
    price: 328.0,
    was: 399.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Sony',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h2',
    rank: 2,
    name: 'Apple - AirPods Pro 2 (USB-C) with MagSafe Case - White',
    price: 189.99,
    was: 249.0,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h3',
    rank: 3,
    name: 'Bose - QuietComfort Ultra Wireless Noise Cancelling Headphones - Black',
    price: 379.0,
    was: 429.0,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Bose',
    image:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h4',
    rank: 4,
    name: 'Samsung - Galaxy Buds3 Pro Wireless Earbuds - Silver',
    price: 199.99,
    was: 249.99,
    tab: 'consumer-electronics',
    brand: 'Samsung',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h5',
    rank: 5,
    name: 'JBL - Flip 6 Portable Waterproof Bluetooth Speaker - Black',
    price: 99.95,
    was: 129.95,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'JBL',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h6',
    rank: 6,
    name: 'Apple - AirPods Max Over-Ear Headphones - Space Gray',
    price: 449.0,
    was: 549.0,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h7',
    rank: 7,
    name: 'Sennheiser - Momentum 4 Wireless Headphones - Black',
    price: 279.95,
    was: 349.95,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Sennheiser',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'h8',
    rank: 8,
    name: 'Beats - Studio Pro Wireless Noise Cancelling Headphones - Black',
    price: 249.99,
    was: 349.99,
    tab: 'consumer-electronics',
    brand: 'Beats',
    image:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
  },

  // ——— Gaming consoles / Toys ———
  {
    id: 't1',
    rank: 1,
    name: 'Sony - PlayStation 5 Slim Console - Disc Edition',
    price: 449.99,
    was: 499.99,
    topDeal: true,
    tab: 'parents-kids-toys',
    brand: 'Sony',
    image:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't2',
    rank: 2,
    name: 'Nintendo - Switch OLED Model with White Joy-Con',
    price: 349.99,
    was: 349.99,
    tab: 'parents-kids-toys',
    brand: 'Nintendo',
    image:
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't3',
    rank: 3,
    name: 'Microsoft - Xbox Series X 1TB Console - Black',
    price: 499.99,
    was: 499.99,
    tab: 'parents-kids-toys',
    brand: 'Microsoft',
    image:
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't4',
    rank: 4,
    name: 'Sony - DualSense Wireless Controller for PS5 - White',
    price: 69.99,
    was: 74.99,
    topDeal: true,
    tab: 'parents-kids-toys',
    brand: 'Sony',
    image:
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't5',
    rank: 5,
    name: 'Meta - Quest 3 128GB All-in-One VR Headset',
    price: 429.99,
    was: 499.99,
    topDeal: true,
    tab: 'parents-kids-toys',
    brand: 'Meta',
    image:
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't6',
    rank: 6,
    name: 'Nintendo - Switch Sports Game + Leg Strap Bundle',
    price: 39.99,
    was: 49.99,
    tab: 'parents-kids-toys',
    brand: 'Nintendo',
    image:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't7',
    rank: 7,
    name: 'LEGO - Technic Ferrari 488 GTE AF Corse #51 Building Set',
    price: 169.99,
    was: 179.99,
    tab: 'parents-kids-toys',
    brand: 'LEGO',
    image:
      'https://images.unsplash.com/photo-1587654780291-39c940171106?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 't8',
    rank: 8,
    name: 'Xbox - Series S 512GB All-Digital Console - White',
    price: 299.99,
    was: 349.99,
    topDeal: true,
    tab: 'parents-kids-toys',
    brand: 'Microsoft',
    image:
      'https://images.unsplash.com/photo-1605901309584-818e25995b6b?auto=format&fit=crop&w=800&q=80',
  },

  // ——— Phones & wearables ———
  {
    id: 'p1',
    rank: 1,
    name: 'Apple - iPhone 16 Pro 128GB - Black Titanium (Unlocked)',
    price: 999.0,
    was: 999.0,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    rank: 2,
    name: 'Samsung - Galaxy S25 Ultra 256GB - Titanium Black (Unlocked)',
    price: 1199.99,
    was: 1299.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Samsung',
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    rank: 3,
    name: 'Google - Pixel 9 Pro 128GB - Obsidian (Unlocked)',
    price: 899.0,
    was: 999.0,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Google',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4',
    rank: 4,
    name: 'Apple - iPhone 16 128GB - Ultramarine (Unlocked)',
    price: 799.0,
    was: 829.0,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p5',
    rank: 5,
    name: 'Apple - Watch Series 10 GPS 42mm - Jet Black Aluminum',
    price: 399.0,
    was: 399.0,
    tab: 'consumer-electronics',
    brand: 'Apple',
    image:
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p6',
    rank: 6,
    name: 'Samsung - Galaxy Watch Ultra 47mm - Titanium Gray',
    price: 649.99,
    was: 699.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'Samsung',
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p7',
    rank: 7,
    name: 'OnePlus - 13 256GB - Black Eclipse (Unlocked)',
    price: 799.99,
    was: 899.99,
    topDeal: true,
    tab: 'consumer-electronics',
    brand: 'OnePlus',
    image:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p8',
    rank: 8,
    name: 'Anker - 737 Power Bank (PowerCore 24K) - Black',
    price: 119.99,
    was: 149.99,
    tab: 'consumer-electronics',
    brand: 'Anker',
    image:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
  },
  // ——— Fashion (BigBasket) ———
  {
    id: 'f1',
    rank: 1,
    name: 'Safari Sprinter Polyester Cabin Rolling Duffle Bag - Grey',
    price: 999,
    was: 5000,
    topDeal: true,
    tab: 'luggage-bags-cases',
    brand: 'Safari',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40370597_1-safari.jpg',
  },
  {
    id: 'f2',
    rank: 2,
    name: 'Jockey 8009 Men\'s Super Combed Cotton Rib Solid Boxer Brief - Black',
    price: 569,
    was: 598,
    topDeal: true,
    tab: 'apparel-accessories',
    brand: 'Jockey',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40326050_1-jockey.jpg',
  },
  {
    id: 'f3',
    rank: 3,
    name: 'Clovia Saree Shapewear - With Drawstring, Nude Colour',
    price: 939,
    was: 1999,
    topDeal: true,
    tab: 'apparel-accessories',
    brand: 'Clovia',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40344466_1-clovia.jpg',
  },
  {
    id: 'f4',
    rank: 4,
    name: 'Jockey 8037 Men\'s Super Combed Cotton Solid Brief - Black',
    price: 399,
    was: 399,
    tab: 'apparel-accessories',
    brand: 'Jockey',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40326061_1-jockey.jpg',
  },
  {
    id: 'f5',
    rank: 5,
    name: 'Jockey 7097 Men\'s Compact Cotton Stretch Low Show Socks - Assorted',
    price: 399,
    was: 399,
    tab: 'apparel-accessories',
    brand: 'Jockey',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40326037_1-jockey.jpg',
  },
  {
    id: 'f6',
    rank: 6,
    name: 'QIPS Luggage Cover Military Green Stretchable Polyester - Small',
    price: 349,
    was: 799,
    topDeal: true,
    tab: 'apparel-accessories',
    brand: 'QIPS',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40366632_1-qips.jpg',
  },
  {
    id: 'f7',
    rank: 7,
    name: 'Lifelong Toiletry Bag / Travel Organiser - Red & Black',
    price: 249,
    was: 899,
    topDeal: true,
    tab: 'luggage-bags-cases',
    brand: 'Lifelong',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40354818_1-lifelong.jpg',
  },
  {
    id: 'f8',
    rank: 8,
    name: 'Vector X Attacker Polyester Gym Shoulder Duffle Bag - Black',
    price: 249,
    was: 599,
    topDeal: true,
    tab: 'luggage-bags-cases',
    brand: 'Vector X',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40363099_1-vector-x.jpg',
  },
  {
    id: 'f9',
    rank: 9,
    name: 'Jewelz Luna Halo Minimal Pendant Necklace',
    price: 199,
    was: 899,
    topDeal: true,
    tab: 'jewelry-eyewear-watches',
    brand: 'Jewelz',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40360775_1-jewelz.jpg',
  },
  {
    id: 'f10',
    rank: 10,
    name: 'Aatmana Women Rose Gold-Plated American Diamond Link Bracelet',
    price: 499,
    was: 2159,
    topDeal: true,
    tab: 'jewelry-eyewear-watches',
    brand: 'Aatmana',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40335004_1-aatmana.jpg',
  },
  {
    id: 'f11',
    rank: 11,
    name: 'Godrej Locks Mylock Candy For Bags With 2 Keys',
    price: 169,
    was: 200,
    tab: 'jewelry-eyewear-watches',
    brand: 'Godrej Locks',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40321797_1-godrej-locks.jpg',
  },
  {
    id: 'f12',
    rank: 12,
    name: 'Se7en Travel PVC Pouch - Waterproof Makeup Organiser',
    price: 99,
    was: 99,
    tab: 'luggage-bags-cases',
    brand: 'Se7en',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40280928_1-se7en.jpg',
  },
  {
    id: 'f13',
    rank: 13,
    name: 'Unitribes Backpack Rain Cover With Clip & Storage Pouch - Neon Yellow',
    price: 99,
    was: 250,
    topDeal: true,
    tab: 'luggage-bags-cases',
    brand: 'Unitribes',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40326274_1-unitribes.jpg',
  },
  {
    id: 'f14',
    rank: 14,
    name: 'Jockey FP03 Men\'s Super Combed Cotton Rib Solid Trunk - Black',
    price: 599,
    was: 599,
    tab: 'luggage-bags-cases',
    brand: 'Jockey',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40326088_1-jockey.jpg',
  },
  {
    id: 'f15',
    rank: 15,
    name: 'Jockey 7051 Men\'s Compact Cotton Stretch Ankle Length Socks - Black',
    price: 289,
    was: 289,
    tab: 'apparel-accessories',
    brand: 'Jockey',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40326036_1-jockey.jpg',
  },
  {
    id: 'f16',
    rank: 16,
    name: 'Safari Stratos Cabin Trolley Bag - Cloudy Grey, 40 L',
    price: 1999,
    was: 7999,
    topDeal: true,
    tab: 'apparel-accessories',
    brand: 'Safari',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40364417_1-safari.jpg',
  },
  {
    id: 'f17',
    rank: 17,
    name: 'Lifelong Pillow - For Camping & Travel',
    price: 289,
    was: 1499,
    topDeal: true,
    tab: 'luggage-bags-cases',
    brand: 'Lifelong',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40341316_1-lifelong.jpg',
  },
  {
    id: 'f18',
    rank: 18,
    name: 'Triphop Travel Toiletry Kit / Essential Bag - Black',
    price: 249,
    was: 999,
    topDeal: true,
    tab: 'luggage-bags-cases',
    brand: 'Triphop',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40332660_1-triphop.jpg',
  },
  {
    id: 'f19',
    rank: 19,
    name: 'Aatmana Gold Plated Evil Eye Charm Bracelet',
    price: 349,
    was: 2999,
    topDeal: true,
    tab: 'jewelry-eyewear-watches',
    brand: 'Aatmana',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40361684_1-aatmana.jpg',
  },
  {
    id: 'f20',
    rank: 20,
    name: 'Aatmana Men Gold-Toned Cuff Bracelet',
    price: 471,
    was: 1745,
    tab: 'jewelry-eyewear-watches',
    brand: 'Aatmana',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40335014_1-aatmana.jpg',
  },
  {
    id: 'f21',
    rank: 21,
    name: 'Se7en Waterproof Touch Sensitive Mobile Rain Pouch',
    price: 49,
    was: 89,
    topDeal: true,
    tab: 'jewelry-eyewear-watches',
    brand: 'Se7en',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40345181_1-se7en.jpg',
  },
  {
    id: 'f22',
    rank: 22,
    name: 'Se7en Waterproof Touch Sensitive Mobile Rain Pouch - Pack of 2',
    price: 69,
    was: 99,
    tab: 'luggage-bags-cases',
    brand: 'Se7en',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40345180_1-se7en.jpg',
  },
  {
    id: 'f23',
    rank: 23,
    name: 'Brodees Fancy Dresses Krishna Costume - Kurta & Dhoti Set',
    price: 129,
    was: 249,
    tab: 'luggage-bags-cases',
    brand: 'Brodees',
    image:
      'https://www.bbassets.com/media/uploads/p/l/40328893_1-brodees.jpg',
  },
]

const sareeProducts: Product[] = (
  dyntraSarees as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image || '')
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: cleanSupplierName(String(p.name)),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'apparel-accessories' as CategoryId,
    subtype: 'sarees' as ApparelSubtype,
    gender: 'women',
    collection: p.categorySlug ? String(p.categorySlug) : undefined,
    categoryName: p.categoryName ? String(p.categoryName) : undefined,
    categorySlug: p.categorySlug ? String(p.categorySlug) : undefined,
    brand: fusoraBrand(p.brand),
    image,
    images: uniqueImages(image),
    description: p.description
      ? cleanSupplierName(String(p.description))
      : undefined,
    source: 'dyntra',
  }
})

const modcartCatalog: Product[] = (
  modcartProducts as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image)
  const images = uniqueImages(
    image,
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  const name = String(p.name)
  const cats = Array.isArray(p.categories)
    ? (p.categories as string[]).join(' ')
    : ''
  const genderBlob = `${name} ${cats}`.toLowerCase()
  const gender: ProductGender = /women|ladies|kurti|saree|dupatta|lehenga/.test(
    genderBlob,
  )
    ? 'women'
    : /men|boy/.test(genderBlob)
      ? 'men'
      : 'unisex'
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name,
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: (String(p.tab) || 'apparel-accessories') as CategoryId,
    subtype: (p.subtype as ApparelSubtype | undefined) || undefined,
    gender,
    brand: String(p.brand || 'Modcart'),
    image: images[0] || image,
    images,
    description: p.description ? String(p.description) : undefined,
  }
})

const denimforgeCatalog: Product[] = (
  denimforgeProducts as Array<Record<string, unknown>>
).map((p, i) => {
  const image = String(p.image || '')
  const images = uniqueImages(
    image,
    Array.isArray(p.images) ? (p.images as string[]) : undefined,
  )
  const collection = String(p.collection || p.categorySlug || 'mens-jeans')
  const gender: ProductGender = collection.startsWith('womens')
    ? 'women'
    : collection.startsWith('mens')
      ? 'men'
      : 'unisex'
  return {
    id: String(p.id),
    rank: Number(p.rank) || i + 1,
    name: cleanSupplierName(String(p.name)),
    price: Number(p.price),
    was: Number(p.was) || Number(p.price),
    topDeal: Boolean(p.topDeal),
    tab: 'apparel-accessories' as CategoryId,
    subtype: 'jeans' as ApparelSubtype,
    gender,
    collection,
    categoryName: p.categoryName ? String(p.categoryName) : undefined,
    categorySlug: collection,
    brand: fusoraBrand(p.brand),
    image: images[0] || image,
    images,
    description: p.description
      ? cleanSupplierName(String(p.description))
      : undefined,
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]).map(String) : undefined,
    fit: p.fit ? String(p.fit) : undefined,
    wash: p.wash ? String(p.wash) : undefined,
    fabric: p.fabric ? String(p.fabric) : undefined,
    sku: p.sku ? String(p.sku) : undefined,
    source: 'thedenimforge',
  }
})

/** Non-electronics leftovers from base catalogue (luggage, jewellery, kids, apparel). */
const baseCatalog: Product[] = baseProducts.filter(
  (p) =>
    p.tab !== 'consumer-electronics' && p.tab !== 'home-appliances',
)

/** Normalize image URL for duplicate detection (ignore query/hash). */
function imageDedupeKey(url: string): string {
  const raw = String(url || '').trim()
  if (!raw) return ''
  try {
    const u = new URL(raw)
    return `${u.host}${u.pathname}`.toLowerCase()
  } catch {
    return raw.split('?')[0].toLowerCase()
  }
}

function isStockPlaceholderImage(url: string): boolean {
  return /pexels\.com|unsplash\.com|picsum\.photos/i.test(url)
}

/** Drop stock placeholders + keep first product per unique photo. */
function dedupeByImage(list: Product[]): Product[] {
  const seen = new Set<string>()
  const out: Product[] = []
  for (const p of list) {
    const img = String(p.image || '').trim()
    // Saree catalogue: skip Pexels/stock placeholders (same model, wrong titles)
    if (p.subtype === 'sarees' && isStockPlaceholderImage(img)) continue
    const key = imageDedupeKey(img)
    if (key) {
      if (seen.has(key)) continue
      seen.add(key)
    }
    out.push(p)
  }
  return out
}

export const staticProducts: Product[] = dedupeByImage([
  ...apparelCoreProducts,
  ...sareeProducts,
  ...modcartCatalog,
  ...denimforgeCatalog,
  ...baseCatalog,
])

/** Built-in catalog + products created in /admin (localStorage). */
export function getProducts(): Product[] {
  let admin: Product[] = []
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('fusora-admin-products')
      if (raw) admin = JSON.parse(raw) as Product[]
    }
  } catch {
    admin = []
  }
  if (!Array.isArray(admin) || admin.length === 0) return staticProducts
  return dedupeByImage([...admin, ...staticProducts])
}

/** @deprecated Prefer getProducts() so admin-added items are included */
export const products: Product[] = staticProducts

export const promoCards = [
  {
    id: 'iphone',
    title: 'New iPhone 16 Pro',
    body: 'Save with qualified activation and trade-in on iPhone 16 Pro.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #1a6dff 0%, #0046be 55%, #00308a 100%)',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mac',
    title: 'MacBook deals',
    body: 'MacBook Air & Pro — limited-time savings for work and creativity.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #3d8bff 0%, #1a5fd4 50%, #0046be 100%)',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'watch',
    title: 'Smartwatches',
    body: 'Apple Watch & Galaxy Watch — fitness and style that keep up.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #2f78f0 0%, #0046be 60%, #002f8a 100%)',
    image:
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'audio',
    title: 'Premium audio',
    body: 'Sony, Bose, AirPods — noise canceling deals this week.',
    cta: 'Shop now',
    gradient: 'linear-gradient(180deg, #4a95ff 0%, #1a66d9 55%, #0046be 100%)',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
]

export const navLinks: { label: string; to: string }[] = [
  { label: 'Shop', to: '/deals' },
  { label: 'Apparel', to: '/category/apparel-accessories' },
  { label: 'Memberships', to: '/memberships' },
  { label: 'Our Story', to: '/about' },
  { label: 'Support', to: '/support' },
]

export function formatMoney(n: number) {
  return n.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
}
