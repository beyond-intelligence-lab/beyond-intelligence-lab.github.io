import { useEffect } from 'react'

import en from '../i18n/en.json'
import { useI18n } from '../i18n'

/** Keeps <title> and the meta description in sync with the active route. */
export function usePageMeta(title: string, description?: string) {
  const { t } = useI18n()
  const pageTitle = title ? `${title} · ${en.site.name}` : `${en.site.name} · ${t.home.university}`
  const pageDescription = description ?? t.home.description

  useEffect(() => {
    document.title = pageTitle
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle)
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageDescription)
  }, [pageTitle, pageDescription])
}
