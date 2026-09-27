import { useEffect } from 'react'

/** Sets document.title for the current page */
export function usePageTitle(title?: string) {
  useEffect(() => {
    const base = 'Fusora'
    document.title = title ? `${title} | ${base}` : `${base} | Chosen, never merely stocked.`
    return () => {
      document.title = `${base} | Chosen, never merely stocked.`
    }
  }, [title])
}
