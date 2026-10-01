import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bil.theme'

/**
 * Colours themselves live in CSS (`light-dark()`); this hook only decides which
 * side of that pair is active, by toggling `data-theme` on <html>.
 *
 * With nothing stored the attribute is left off entirely, so the page follows
 * the OS preference live. Choosing a theme pins it until the user changes it.
 */
function readInitialTheme(): Theme {
  const stored = document.documentElement.dataset.theme
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* not fatal — the choice just will not survive a reload */
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
