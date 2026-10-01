export const LOCALES = ['en', 'zh'] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  zh: '中文',
}

/** BCP 47 tags used for `Intl` formatting and the `lang` attribute. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
}

/**
 * A piece of content that exists in every supported language. Used by the
 * data files (publications, team, news) so they stay out of the dictionaries.
 */
export type Localized<T = string> = Record<Locale, T>

export function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value)
}
