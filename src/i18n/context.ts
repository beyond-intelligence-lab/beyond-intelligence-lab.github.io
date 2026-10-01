import { createContext } from 'react'

import type { Messages } from './messages'
import type { Locale, Localized } from './types'

export type I18nValue = {
  /** Active language. */
  locale: Locale
  /** Switch language; persists to localStorage for the next visit. */
  setLocale: (locale: Locale) => void
  /** UI strings for the active language. Usage: `t.nav.research`. */
  t: Messages
  /** Resolve a `{ en, zh }` record from the data files into the active language. */
  localize: <T>(value: Localized<T>) => T
}

/**
 * Lives in its own module so that `I18nProvider` and `useI18n` can both import
 * it without either file exporting a non-component (which would break Fast
 * Refresh).
 */
export const I18nContext = createContext<I18nValue | null>(null)
