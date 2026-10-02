import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { ArrowRightIcon } from '../components/icons'
import { NEWS_ITEMS } from '../data/news'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import type { Locale } from '../i18n/types'
import { LOCALE_TAGS } from '../i18n/types'
import './Home.css'

/** How many entries the home page shows; the rest stay in `news.toml`. */
const RECENT_COUNT = 5

/**
 * The two cards under the news. Only the route lives here; the titles and
 * blurbs are page copy and sit in the dictionaries, like the rest of the page.
 */
const EXPLORE_CARDS = [
  { key: 'research', to: '/publications' },
  { key: 'projects', to: '/projects' },
] as const

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

/**
 * One visit's worth of drift settings for the hero glow: where it sits, how big
 * it is, and how it wanders. Handed to the CSS as custom properties, so the
 * stylesheet keeps the look and this keeps only the dice roll.
 */
function rollGlow() {
  const between = (min: number, max: number) => min + Math.random() * (max - min)
  const sign = () => (Math.random() < 0.5 ? -1 : 1)
  const radius = () => `${between(38, 62).toFixed(0)}%`

  return {
    // Centre of the glow, in percent of its layer — the slogan's column, not
    // the whole banner — and biased low so it sits under the slogan.
    '--glow-x': `${between(10, 90).toFixed(1)}%`,
    '--glow-y': `${between(40, 62).toFixed(1)}%`,
    '--glow-w': `${between(34, 56).toFixed(1)}rem`,
    '--glow-opacity': between(0.34, 0.58).toFixed(2),
    '--glow-scale': between(0.92, 1.15).toFixed(2),
    '--glow-drift-x': `${(sign() * between(4, 12)).toFixed(1)}%`,
    '--glow-drift-y': `${(sign() * between(8, 20)).toFixed(1)}%`,
    // An uneven outline, turned as the loop runs: the glow's hot spots rotate,
    // which is what reads as flow rather than a shape sliding about.
    '--glow-radius': `${radius()} ${radius()} ${radius()} ${radius()} / ${radius()} ${radius()} ${radius()} ${radius()}`,
    '--glow-spin': `${(sign() * between(6, 16)).toFixed(1)}deg`,
    '--glow-duration': `${between(18, 34).toFixed(1)}s`,
    '--glow-delay': `${(-between(0, 18)).toFixed(1)}s`,
  } as CSSProperties
}

/**
 * A single blurred glow drifting behind the hero. Position, size and rhythm
 * are rolled once per mount, so it wanders somewhere new on every visit.
 * Decoration only: hidden from assistive tech, and the global
 * `prefers-reduced-motion` rule freezes the drift.
 *
 * The roll happens in the state initialiser, which React runs once per mount
 * (and is allowed to be impure, unlike render).
 */
function GlowField() {
  const [style] = useState(rollGlow)

  return (
    <div className="banner__glow" aria-hidden="true">
      <span className="banner__glow-blob" style={style} />
    </div>
  )
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
        <GlowField />
        <div className="container">
          <h1 className="banner__slogan">{t.home.slogan}</h1>
          {t.home.lead ? <p className="banner__lead">{t.home.lead}</p> : null}
        </div>
      </section>

      {/* Reserved for the lab's introduction — no heading of its own. Bottom
          padding is dropped so the news section's own top padding sets the gap
          between the two. */}
      <section className="home-intro">
        <div className="container">
          <p className="home-intro__text">
            {t.home.intro.split(/(\{fanWu\}|\{chaoyueNiu\}|\{university\})/g).map((part, index) => {
              if (part === '{university}') {
                return (
                  <span key={index} className="home-intro__university">
                    <img className="home-intro__emblem" src="/sjtu-emblem.png" alt="" width="240" height="240" />
                    {t.home.university}
                  </span>
                )
              }
              const nameKey = part === '{fanWu}' ? 'fanWu' : part === '{chaoyueNiu}' ? 'chaoyueNiu' : null
              return nameKey ? (
                <Link key={index} to="/group">{t.home.introNames[nameKey]}</Link>
              ) : part
            })}
          </p>
        </div>
      </section>

      {/* Nothing to announce yet — the section is simply absent rather than
          showing an empty timeline. */}
      {recent.length > 0 ? (
        <section className="home-news">
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

      <section className="section">
        <div className="container">
          <ul className="explore">
            {EXPLORE_CARDS.map(({ key, to }) => (
              <li key={key} className="explore__card">
                <h2 className="explore__title">{t.home.cards[key].title}</h2>
                <p className="explore__blurb">{t.home.cards[key].blurb}</p>
                {/* Both buttons read "Explore", so the card's title is folded
                    into the accessible name to tell them apart. */}
                <Link className="button button--ghost explore__action" to={to}>
                  {t.home.explore}
                  <span className="visually-hidden">：{t.home.cards[key].title}</span>
                  <ArrowRightIcon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
