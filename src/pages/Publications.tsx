import { useState } from 'react'

import PageHeader from '../components/PageHeader'
import PublicationCard from '../components/PublicationCard'
import PublicationFilters from '../components/PublicationFilters'
import { PUBLICATIONS, TOPICS } from '../data/publications'
import type { Publication } from '../data/publications'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import './Publications.css'

/** Groups an already year-sorted list into consecutive runs of the same year. */
function groupByYear(publications: readonly Publication[]) {
  const groups: { year: number; items: Publication[] }[] = []
  for (const publication of publications) {
    const current = groups.at(-1)
    if (current && current.year === publication.year) current.items.push(publication)
    else groups.push({ year: publication.year, items: [publication] })
  }
  return groups
}

export default function Publications() {
  const { t } = useI18n()
  usePageMeta(t.nav.publications)
  const [active, setActive] = useState<string | null>(null)

  // Papers are tagged with several areas, but the filter shows one at a time.
  // The TOML can drop the selected topic (or its last entry) while the page is
  // open, e.g. on a hot reload — fall back to showing everything.
  const activeTopic =
    TOPICS.some((topic) => topic.id === active && topic.count > 0) ? active : null

  const visible =
    activeTopic === null
      ? PUBLICATIONS
      : PUBLICATIONS.filter((publication) => publication.topics.includes(activeTopic))

  // Derived from the visible list, so a filter that empties a year drops its
  // heading too.
  const years = groupByYear(visible)

  return (
    <>
      <PageHeader title={t.nav.publications} />
      <section className="section">
        <div className="container">
          {PUBLICATIONS.length === 0 ? (
            <p className="publications__empty">{t.publications.empty}</p>
          ) : (
            <>
              {/* Year headings are h3 and card titles h4, so the list needs a
                  parent heading of its own to keep the outline unbroken. */}
              <h2 className="visually-hidden">{t.publications.listLabel}</h2>

              {/* A live region here rather than on the <ol>: announcing the result
                  count is enough, re-reading every card after each click is not. */}
              <p role="status" className="visually-hidden">
                {t.publications.shown
                  .replace('{count}', String(visible.length))
                  .replace('{total}', String(PUBLICATIONS.length))}
              </p>

              {/* Filters come first in the DOM, so they land on top on small
                  screens and in the left column once there is room for both. */}
              <div className="publications__layout">
                <PublicationFilters
                  topics={TOPICS}
                  total={PUBLICATIONS.length}
                  active={activeTopic}
                  onSelect={setActive}
                />

                <ol className="publications__years">
                  {years.map((group) => (
                    <li key={group.year}>
                      <h3 className="publications__year">{group.year}</h3>
                      <ol className="publications__list">
                        {group.items.map((publication) => (
                          <PublicationCard key={publication.id} publication={publication} />
                        ))}
                      </ol>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
