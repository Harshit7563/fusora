/** Marketplace categories (Categories for you) */
export type CategoryId =
  | 'men'
  | 'women'
  | 'apparel-accessories'
  | 'consumer-electronics'
  | 'sports-entertainment'
  | 'jewelry-eyewear-watches'
  | 'packaging-printing'
  | 'home-garden'
  | 'sportswear-outdoor'
  | 'beauty'
  | 'shoes-accessories'
  | 'luggage-bags-cases'
  | 'parents-kids-toys'
  | 'personal-home-care'
  | 'health-medical'
  | 'gifts-crafts'
  | 'pet-supplies'
  | 'school-office'
  | 'industrial-machinery'
  | 'commercial-equipment'
  | 'construction-building-machinery'
  | 'construction-real-estate'
  | 'furniture'
  | 'lights-lighting'
  | 'home-appliances'
  | 'automotive-supplies'
  | 'vehicle-parts'
  | 'tools-hardware'
  | 'renewable-energy'
  | 'electrical-equipment'
  | 'safety-security'
  | 'material-handling'
  | 'testing-instruments'
  | 'power-transmission'
  | 'electronic-components'
  | 'vehicles-transportation'
  | 'agriculture-food-beverage'
  | 'raw-materials'
  | 'fabrication-services'
  | 'services'

export type ShopCategory = {
  id: CategoryId
  label: string
  emoji: string
}

export const shopCategories: ShopCategory[] = [
  { id: 'men', label: 'Men', emoji: '👔' },
  { id: 'women', label: 'Women', emoji: '👗' },
  { id: 'apparel-accessories', label: 'Apparel & Clothes', emoji: '👕' },
  { id: 'consumer-electronics', label: 'Consumer Electronics', emoji: '📱' },
  { id: 'sports-entertainment', label: 'Sports & Entertainment', emoji: '🎯' },
  {
    id: 'jewelry-eyewear-watches',
    label: 'Artificial Jewellery',
    emoji: '💎',
  },
  { id: 'packaging-printing', label: 'Packaging & Printing', emoji: '📦' },
  { id: 'home-garden', label: 'Home & Garden', emoji: '🏡' },
  {
    id: 'sportswear-outdoor',
    label: 'Sportswear & Outdoor Apparel',
    emoji: '🏃',
  },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'shoes-accessories', label: 'Shoes & Accessories', emoji: '👟' },
  { id: 'luggage-bags-cases', label: 'Luggage, Bags & Cases', emoji: '🧳' },
  { id: 'parents-kids-toys', label: 'Parents, Kids & Toys', emoji: '🧸' },
  {
    id: 'personal-home-care',
    label: 'Personal Care & Home Care',
    emoji: '🧴',
  },
  { id: 'health-medical', label: 'Health & Medical', emoji: '🩺' },
  { id: 'gifts-crafts', label: 'Gifts & Crafts', emoji: '🎁' },
  { id: 'pet-supplies', label: 'Pet Supplies', emoji: '🐾' },
  { id: 'school-office', label: 'School & Office Supplies', emoji: '📎' },
  { id: 'industrial-machinery', label: 'Industrial Machinery', emoji: '⚙️' },
  {
    id: 'commercial-equipment',
    label: 'Commercial Equipment & Machinery',
    emoji: '🏭',
  },
  {
    id: 'construction-building-machinery',
    label: 'Construction & Building Machinery',
    emoji: '🚧',
  },
  {
    id: 'construction-real-estate',
    label: 'Construction & Real Estate',
    emoji: '🏗️',
  },
  { id: 'furniture', label: 'Furniture', emoji: '🛋️' },
  { id: 'lights-lighting', label: 'Lights & Lighting', emoji: '💡' },
  { id: 'home-appliances', label: 'Home Appliances', emoji: '🧊' },
  {
    id: 'automotive-supplies',
    label: 'Automotive Supplies & Tools',
    emoji: '🔧',
  },
  {
    id: 'vehicle-parts',
    label: 'Vehicle Parts & Accessories',
    emoji: '🚗',
  },
  { id: 'tools-hardware', label: 'Tools & Hardware', emoji: '🛠️' },
  { id: 'renewable-energy', label: 'Renewable Energy', emoji: '☀️' },
  {
    id: 'electrical-equipment',
    label: 'Electrical Equipment & Supplies',
    emoji: '🔌',
  },
  { id: 'safety-security', label: 'Safety & Security', emoji: '🔒' },
  { id: 'material-handling', label: 'Material Handling', emoji: '🏗️' },
  {
    id: 'testing-instruments',
    label: 'Testing Instrument & Equipment',
    emoji: '🧪',
  },
  { id: 'power-transmission', label: 'Power Transmission', emoji: '⚡' },
  {
    id: 'electronic-components',
    label: 'Electronic Components',
    emoji: '💽',
  },
  {
    id: 'vehicles-transportation',
    label: 'Vehicles & Transportation',
    emoji: '🚛',
  },
  {
    id: 'agriculture-food-beverage',
    label: 'Agriculture, Food & Beverage',
    emoji: '🌾',
  },
  { id: 'raw-materials', label: 'Raw Materials', emoji: '🧱' },
  { id: 'fabrication-services', label: 'Fabrication Services', emoji: '🔩' },
  { id: 'services', label: 'Services', emoji: '🤝' },
]

/** @deprecated alias — use shopCategories */
export const dealTabs = shopCategories.map((c) => ({
  id: c.id,
  label: c.label,
}))

export type DealTab = CategoryId

export function getCategory(id: string | undefined) {
  const builtIn = shopCategories.find((c) => c.id === id)
  if (builtIn) return builtIn
  try {
    if (typeof localStorage !== 'undefined' && id) {
      const raw = localStorage.getItem('fusora-admin-categories')
      const list = raw
        ? (JSON.parse(raw) as Array<{ id: string; label: string; emoji?: string }>)
        : []
      const custom = list.find((c) => c.id === id)
      if (custom) {
        return {
          id: custom.id as CategoryId,
          label: custom.label,
          emoji: custom.emoji || '🛍️',
        }
      }
    }
  } catch {
    /* ignore */
  }
  return shopCategories[0]
}

export function getAllShopCategories(): ShopCategory[] {
  const custom: ShopCategory[] = []
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('fusora-admin-categories')
      const list = raw
        ? (JSON.parse(raw) as Array<{ id: string; label: string; emoji?: string }>)
        : []
      for (const c of list) {
        if (shopCategories.some((s) => s.id === c.id)) continue
        custom.push({
          id: c.id as CategoryId,
          label: c.label,
          emoji: c.emoji || '🛍️',
        })
      }
    }
  } catch {
    /* ignore */
  }
  return [...custom, ...shopCategories]
}
