import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { I18nContext } from './context'
import type { I18nValue } from './context'
import { DICTIONARIES } from './messages'
import { LOCALE_TAGS, isLocale } from './types'
import type { Locale, Localized } from './types'

const STORAGE_KEY = 'bil.locale'

/** English is the default; only an explicit choice by the visitor overrides it. */
function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    /* localStorage can throw in private mode — ignore and fall through */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = LOCALE_TAGS[locale]
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* not fatal — the choice just will not survive a reload */
    }
  }, [])

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: DICTIONARIES[locale],
      localize: <T,>(record: Localized<T>) => record[locale],
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
