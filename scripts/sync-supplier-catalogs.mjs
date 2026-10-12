#!/usr/bin/env node
/**
 * Sync live Dyntra + The Denim Forge catalogs into src/data/*.json
 *
 * Usage: node scripts/sync-supplier-catalogs.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const UA = { 'User-Agent': 'Mozilla/5.0 FusoraCatalogSync/1.0' }

function cleanSupplierName(name) {
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

function imageDedupeKey(url) {
  const raw = String(url || '').trim()
  if (!raw) return ''
  try {
    const u = new URL(raw)
    return `${u.host}${u.pathname}`.toLowerCase()
  } catch {
    return raw.split('?')[0].toLowerCase()
  }
}

/** Drop stock placeholders + keep first product per unique photo. */
function dedupeByImage(list) {
  const seen = new Set()
  const out = []
  for (const p of list) {
    const img = String(p.image || '').trim()
    if (/pexels\.com|unsplash\.com|picsum\.photos/i.test(img)) continue
    const key = imageDedupeKey(img)
    if (key) {
      if (seen.has(key)) continue
      seen.add(key)
    }
    out.push(p)
  }
  return out.map((p, i) => ({ ...p, rank: i + 1 }))
}

async function getJson(url) {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

async function fetchDyntra() {
  const first = await getJson('https://api.dyntra.in/api/products?limit=100&page=1')
  const pages = Number(first.pages || 1)
  const all = [...(first.products || [])]
  for (let page = 2; page <= pages; page++) {
    const data = await getJson(
      `https://api.dyntra.in/api/products?limit=100&page=${page}`,
    )
    all.push(...(data.products || []))
  }
  const cats = await getJson('https://api.dyntra.in/api/categories')
  const byId = new Map()
  for (const p of all) byId.set(p.id, p)
  const products = [...byId.values()]

  const out = products
    .sort(
      (a, b) =>
        Number(!!b.is_featured) - Number(!!a.is_featured) ||
        Number(!!b.is_new) - Number(!!a.is_new) ||
        a.id - b.id,
    )
    .map((p, i) => {
      const price = Math.round(Number(p.price || 0))
      let was = Math.round(Number(p.compare_price || price))
      if (was < price) was = price
      let img = p.image_url || ''
      if (img.startsWith('/')) img = `https://api.dyntra.in${img}`
      return {
        id: `ds${p.id}`,
        sourceId: p.id,
        rank: i + 1,
        name: cleanSupplierName(p.name),
        price,
        was,
        topDeal: Boolean(p.is_featured) || Boolean(p.is_new) || price <= 500,
        tab: 'apparel-accessories',
        subtype: 'sarees',
        brand: 'Fusora',
        image: img,
        slug: p.slug || '',
        description: cleanSupplierName(
          p.description || `Authentic handwoven ${p.name}.`,
        ),
        occasion: p.occasion || '',
        categoryName: p.category_name || 'Sarees',
        categorySlug: p.category_slug || 'sarees',
        source: 'dyntra',
        isNew: Boolean(p.is_new),
        stock: Number(p.stock || 0),
      }
    })

  const categories = (cats || []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    groupType: c.group_type,
    image: c.image_url
      ? c.image_url.startsWith('http')
        ? c.image_url
        : `https://api.dyntra.in${c.image_url}`
      : null,
    sortOrder: c.sort_order || 0,
  }))

  return { products: dedupeByImage(out), categories }
}

async function fetchDenimForge() {
  const products = await getJson(
    'https://thedenimforge.com/api/products?limit=1000',
  )
  const BASE = 'https://thedenimforge.com'
  const abs = (u) => {
    const s = String(u || '').trim()
    if (!s) return ''
    if (s.startsWith('http')) return s
    return s.startsWith('/') ? BASE + s : `${BASE}/${s}`
  }

  const out = [...products]
    .sort(
      (a, b) =>
        Number(!!b.is_featured) - Number(!!a.is_featured) ||
        Number(!!b.is_new) - Number(!!a.is_new) ||
        String(a.name).localeCompare(String(b.name)),
    )
    .map((p, i) => {
      const wholesale = Number(p.wholesale_price || 0)
      const retail = Number(p.retail_price || wholesale)
      const price = Math.round(wholesale > 0 ? wholesale : retail)
      const was = Math.round(retail > price ? retail : price)
      let raw = p.images || []
      if (typeof raw === 'string') {
        try {
          raw = JSON.parse(raw)
        } catch {
          raw = [raw]
        }
      }
      const images = []
      const seen = new Set()
      for (const u of raw) {
        const au = abs(u)
        if (au && !seen.has(au)) {
          seen.add(au)
          images.push(au)
        }
      }
      const collection =
        ['mens-jeans', 'womens-jeans', 'kids-jeans'].includes(p.category_slug)
          ? p.category_slug
          : 'mens-jeans'
      let sizes = p.sizes || []
      if (typeof sizes === 'string') {
        try {
          sizes = JSON.parse(sizes)
        } catch {
          sizes = []
        }
      }
      return {
        id: `df${i + 1}`,
        sourceId: p.id,
        rank: i + 1,
        name: cleanSupplierName(p.name),
        price,
        was,
        topDeal:
          Boolean(p.is_featured) ||
          Boolean(p.is_bestseller) ||
          Boolean(p.is_new),
        tab: 'apparel-accessories',
        subtype: 'jeans',
        collection,
        categoryName: p.category_name || collection,
        categorySlug: collection,
        brand: 'Fusora',
        image: images[0] || '',
        images,
        description: cleanSupplierName(
          p.description || p.short_description || '',
        ),
        slug: p.slug || '',
        sku: p.sku || '',
        source: 'thedenimforge',
        fit: p.fit || '',
        wash: p.wash || '',
        fabric: p.fabric || '',
        sizes,
        moq: Number(p.moq || 1),
        isNew: Boolean(p.is_new),
        isBestseller: Boolean(p.is_bestseller),
      }
    })

  const categories = [
    {
      slug: 'mens-jeans',
      name: "Men's Jeans",
      blurb: 'Wholesale mens denim — fits, washes & everyday staples.',
      image:
        out.find((p) => p.collection === 'mens-jeans' && p.image)?.image || '',
    },
    {
      slug: 'womens-jeans',
      name: "Women's Jeans",
      blurb: 'Wholesale womens denim — bootcut, skinny, wide leg & more.',
      image:
        out.find((p) => p.collection === 'womens-jeans' && p.image)?.image ||
        '',
    },
    {
      slug: 'kids-jeans',
      name: 'Kids Jeans',
      blurb: 'Durable kids denim for retailers and distributors.',
      image:
        out.find((p) => p.collection === 'kids-jeans' && p.image)?.image || '',
    },
  ]

  return { products: dedupeByImage(out), categories }
}

const dyn = await fetchDyntra()
const denim = await fetchDenimForge()

writeFileSync(
  join(ROOT, 'src/data/dyntraSarees.json'),
  JSON.stringify(dyn.products),
)
writeFileSync(
  join(ROOT, 'src/data/dyntraCategories.json'),
  JSON.stringify(dyn.categories, null, 2),
)
writeFileSync(
  join(ROOT, 'src/data/denimforgeProducts.json'),
  JSON.stringify(denim.products),
)
writeFileSync(
  join(ROOT, 'src/data/denimforgeCategories.json'),
  JSON.stringify(denim.categories, null, 2),
)

console.log(
  `Synced Dyntra ${dyn.products.length} products / ${dyn.categories.length} categories`,
)
console.log(
  `Synced Denim Forge ${denim.products.length} products / ${denim.categories.length} categories`,
)
