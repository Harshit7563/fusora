import type { Product } from '../data'

export type Gender = 'men' | 'women' | 'unisex'

export function getProductGender(p: Product): Gender {
  if (p.gender === 'men' || p.gender === 'women' || p.gender === 'unisex') {
    return p.gender
  }

  const blob = [
    p.collection,
    p.categorySlug,
    p.categoryName,
    p.name,
    p.subtype,
    p.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (p.subtype === 'sarees') return 'women'
  if (p.collection === 'mens-jeans' || p.categorySlug === 'mens-jeans') {
    return 'men'
  }
  if (p.collection === 'womens-jeans' || p.categorySlug === 'womens-jeans') {
    return 'women'
  }
  if (p.collection === 'kids-jeans' || p.categorySlug === 'kids-jeans') {
    return 'unisex'
  }

  if (
    /\bwomens?\b|\bladies\b|\bgirls?\b|women'?s|kurti|lehenga|\bsaree\b|dupatta|anarkali/.test(
      blob,
    )
  ) {
    return 'women'
  }

  if (/\bmens?\b|\bboys?\b|men'?s/.test(blob)) {
    return 'men'
  }

  if (/\bkids?\b|\bchild/.test(blob)) return 'unisex'

  return 'unisex'
}

/** Strict: Men page = men only, Women page = women only (no unisex bleed). */
export function matchesGender(p: Product, gender: Gender): boolean {
  return getProductGender(p) === gender
}
