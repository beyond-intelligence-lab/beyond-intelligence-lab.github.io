import { useEffect } from 'react'

import en from '../i18n/en.json'

/** Keeps <title> and the meta description in sync with the active route. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${en.site.name}` : en.site.name
  }, [title])

  useEffect(() => {
    if (!description) return
    const tag = document.querySelector('meta[name="description"]')
    if (tag) tag.setAttribute('content', description)
  }, [description])
}
