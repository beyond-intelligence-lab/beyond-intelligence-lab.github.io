import raw from './publications.toml'
import { parsePublicationData } from './publication-schema'
import type { Publication, TopicEntry } from './publication-schema'

export { LINK_KINDS } from './publication-schema'
export type { LinkKind, Publication, PublicationLink } from './publication-schema'

/** A declared topic plus how many publications carry it, for the filter chips. */
export type Topic = TopicEntry & { count: number }

export type VenueKind = 'conference' | 'journal' | 'preprint'

/**
 * Journal display names (the year suffix is stripped before lookup). Anything
 * else is treated as a conference; `arXiv` is a preprint. A new journal needs
 * an entry here, or its label renders in the conference colour.
 */
const JOURNAL_NAMES = new Set([
  'IEEE TSC',
  'IEEE TMC',
  'IEEE TNNLS',
  'IEEE TKDE',
  'IEEE TDSC',
  'ACM CSUR',
  'INFORMS JoC',
  'JPDC',
  'Information Sciences',
  'JNCA',
  'IMWUT',
])

/** Drives the venue chip colour on `PublicationCard`. */
export function venueKind(label: string): VenueKind {
  const name = label.replace(/\s+\d{4}$/, '')
  if (name === 'arXiv') return 'preprint'
  return JOURNAL_NAMES.has(name) ? 'journal' : 'conference'
}

/** The order a year's entries are listed in: journals, conferences, preprints. */
const KIND_ORDER: Record<VenueKind, number> = { journal: 0, conference: 1, preprint: 2 }

/**
 * An entry's rank within its year, taken from its best venue — a conference
 * paper that later got a journal extension carries both and files as a journal.
 */
function kindRank(publication: Publication): number {
  return Math.min(...publication.venues.map((venue) => KIND_ORDER[venueKind(venue)]))
}

const data = parsePublicationData(raw, 'src/data/publications.toml')

/**
 * Newest year first, then journals before conferences before preprints within
 * each year. `sort` is stable, so entries still tied keep their file order.
 */
export const PUBLICATIONS: readonly Publication[] = [...data.publications].sort(
  (a, b) => b.year - a.year || kindRank(a) - kindRank(b),
)

const counts = new Map<string, number>()
// Where a topic's newest paper sits in the list. `PUBLICATIONS` is already in
// display order, so a topic's first sighting is its most recent work — and
// ranking by position (not just year) keeps the areas in step with the cards:
// ACM MM ahead of KDD within 2026 means 3D Vision ahead of Data Markets too.
const rank = new Map<string, number>()
PUBLICATIONS.forEach((publication, index) => {
  for (const id of publication.topics) {
    counts.set(id, (counts.get(id) ?? 0) + 1)
    if (!rank.has(id)) rank.set(id, index)
  }
})

/** Newest work first; a topic with nothing published sinks to the bottom. */
export const TOPICS: readonly Topic[] = data.topics
  .map((topic) => ({ ...topic, count: counts.get(topic.id) ?? 0 }))
  .sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity))
