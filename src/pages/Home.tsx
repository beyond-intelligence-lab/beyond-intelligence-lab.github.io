import { Link } from 'react-router-dom'

import { NEWS_ITEMS } from '../data/news'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import type { Locale } from '../i18n/types'
import { LOCALE_TAGS } from '../i18n/types'
import './Home.css'

/** How many entries the home page shows; the rest stay in `news.toml`. */
const RECENT_COUNT = 5

/** `2026-08` announces a month; `2026-08-26` names a day. */
const MONTH_ONLY = /^\d{4}-\d{2}$/

/**
 * `2026-08` → "Aug 2026", `2026-08-26` → "Aug 26, 2026". Read back in UTC: the
 * value is a calendar month or day, not an instant, so a reader west of
 * Greenwich must not see the one before it.
 */
function makeDateFormatter(locale: Locale) {
  const tag = LOCALE_TAGS[locale]
  const month = new Intl.DateTimeFormat(tag, { year: 'numeric', month: 'short', timeZone: 'UTC' })
  const day = new Intl.DateTimeFormat(tag, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (date: string) => {
    const monthOnly = MONTH_ONLY.test(date)
    // A month has no day to parse, so pin it to the 1st before reading it back.
    const iso = monthOnly ? `${date}-01T00:00:00Z` : `${date}T00:00:00Z`
    return (monthOnly ? month : day).format(new Date(iso))
  }
}

/**
 * The news files mark the parts worth emphasising with `**…**`. `split` with a
 * capturing group interleaves the text and the captures, so the odd indices are
 * exactly the emphasised runs. Nothing is parsed as markup, so no string in the
 * TOML can turn into HTML.
 */
function withEmphasis(text: string) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part))
}

export default function Home() {
  const { t, locale } = useI18n()
  // The slogan is the page's h1, so the document title is just the site name.
  usePageMeta('')

  const recent = NEWS_ITEMS.slice(0, RECENT_COUNT)
  const formatDate = makeDateFormatter(locale)

  return (
    <>
      <section className="banner">
        <div className="container">
          <h1 className="banner__slogan">{t.home.slogan}</h1>
          {t.home.lead ? <p className="banner__lead">{t.home.lead}</p> : null}
        </div>
      </section>

      {/* Nothing to announce yet — the section is simply absent rather than
          showing an empty timeline. */}
      {recent.length > 0 ? (
        <section className="section">
          <div className="container">
            <h2 className="section__title timeline__title">{t.home.newsTitle}</h2>
            <ol className="timeline">
              {recent.map((item) => {
                const body = withEmphasis(item[locale])

                return (
                  <li key={item.id} className="timeline__item">
                    <time className="timeline__date" dateTime={item.date}>
                      {formatDate(item.date)}
                    </time>
                    {item.link === undefined ? (
                      <p className="timeline__text">{body}</p>
                    ) : item.link.startsWith('/') ? (
                      <Link className="timeline__text timeline__link" to={item.link}>
                        {body}
                      </Link>
                    ) : (
                      <a
                        className="timeline__text timeline__link"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {body}
                      </a>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      ) : null}
    </>
  )
}
