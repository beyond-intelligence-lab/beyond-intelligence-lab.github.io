import raw from './publications.toml'
import { parsePublicationData } from './publication-schema'
import type { Publication, TopicEntry, VenueKind } from './publication-schema'

export { LINK_KINDS } from './publication-schema'
export type { LinkKind, Publication, PublicationLink } from './publication-schema'

/** A declared topic plus how many publications carry it, for the filter chips. */
export type Topic = TopicEntry & { count: number }

export type { VenueKind } from './publication-schema'

const data = parsePublicationData(raw, 'src/data/publications.toml')

/** Keep track suffixes: ICMR 2025 Workshop resolves to ICMR Workshop, not ICMR. */
export function venueInfo(label: string) {
  return data.venues.get(label.replace(/\s+\d{4}(?=\s|$)/, ''))
}

/** Drives the venue chip colour on `PublicationCard`. */
export function venueKind(label: string): VenueKind {
  return venueInfo(label)?.kind ?? (label === 'arXiv' ? 'preprint' : 'conference')
}

/** Within each year: CCF A, B, C, unranked venues, then preprints. */
const CCF_ORDER = { A: 0, B: 1, C: 2 } as const

/**
 * A conference + journal extension uses its highest CCF tier. A preprint link
 * on a formally published paper does not make that paper an arXiv entry.
 */
function ccfRank(publication: Publication): number {
  return Math.min(...publication.venues.map((venue) => {
    const info = venueInfo(venue)
    if (venueKind(venue) === 'preprint') return 4
    return info?.ccf ? CCF_ORDER[info.ccf] : 3
  }))
}

/**
 * Newest year first, then CCF tier. Stable sort preserves the TOML order within
 * each tier, where conference dates (latest first) are curated with sources.
 */
export const PUBLICATIONS: readonly Publication[] = [...data.publications].sort(
  (a, b) => b.year - a.year || ccfRank(a) - ccfRank(b),
)

const counts = new Map<string, number>()
// Where a topic's newest paper sits in the list. `PUBLICATIONS` is already in
// display order, so ranking by position keeps the areas in step with the cards.
const rank = new Map<string, number>()
PUBLICATIONS.forEach((publication, index) => {
  for (const id of publication.topics) {
    counts.set(id, (counts.get(id) ?? 0) + 1)
    if (!rank.has(id)) rank.set(id, index)
  }
})

/** Follow publication display order; topics with no publications go last. */
export const TOPICS: readonly Topic[] = data.topics
  .map((topic) => ({ ...topic, count: counts.get(topic.id) ?? 0 }))
  .sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity))
