import type { Topic } from '../data/publications'
import { useI18n } from '../i18n'
import './PublicationFilters.css'

type PublicationFiltersProps = {
  topics: readonly Topic[]
  /** Number of publications across all topics, for the "All" chip. */
  total: number
  /** Selected topic id, or `null` for "All". */
  active: string | null
  onSelect: (topicId: string | null) => void
}

/**
 * Single-select filter: one area at a time (papers may still carry several
 * tags). Toggle buttons in a labelled group rather than a `radiogroup` —
 * native buttons are announced as pressed/not pressed, stay tabbable, and need
 * no roving-tabindex or arrow-key code.
 */
export default function PublicationFilters({
  topics,
  total,
  active,
  onSelect,
}: PublicationFiltersProps) {
  const { t, locale } = useI18n()

  return (
    <div className="publication-filters" role="group" aria-label={t.publications.filterLabel}>
      <button
        type="button"
        className="publication-filters__chip publication-filters__chip--all"
        aria-pressed={active === null}
        onClick={() => onSelect(null)}
      >
        {t.publications.filterAll}
        <span className="publication-filters__count">{total}</span>
      </button>

      {topics
        // A chip that leads to an empty list is a dead end; the page also hides
        // the whole row when there is nothing at all.
        .filter((topic) => topic.count > 0)
        .map((topic) => (
          <button
            key={topic.id}
            type="button"
            className="publication-filters__chip"
            aria-pressed={active === topic.id}
            onClick={() => onSelect(topic.id)}
          >
            {topic[locale]}
            <span className="publication-filters__count">{topic.count}</span>
          </button>
        ))}
    </div>
  )
}
