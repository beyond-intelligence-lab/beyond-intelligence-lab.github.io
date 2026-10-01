/**
 * Validation for `publications.toml`.
 *
 * The TOML arrives as `unknown` and is hand-edited, so the risky failure is a
 * typo that parses fine but means something else — `[[publication]]` instead of
 * `[[publications]]` would silently yield an empty list. Everything is checked
 * here instead, and every problem is collected before throwing, so one run
 * reports all the mistakes rather than only the first.
 *
 * Kept dependency-free so `vite.config.ts` can call it at build time too: bad
 * data then fails `pnpm build` (and CI) instead of the browser.
 */

// Explicit extension: this module is also pulled into the node project (via
// `vite.config.ts`), whose nodenext resolution requires it. Both tsconfigs
// allow `.ts` imports, and Vite resolves them as usual.
import { isRecord, readString, reportProblems } from './schema-utils.ts'

export const LINK_KINDS = ['paper', 'code', 'project', 'slides', 'arxiv'] as const

export type LinkKind = (typeof LINK_KINDS)[number]

export type PublicationLink = {
  kind: LinkKind
  href: string
}

/** A research topic as declared in the TOML; `en`/`zh` label the filter chip. */
export type TopicEntry = {
  id: string
  en: string
  zh: string
}

export type Publication = {
  id: string
  title: string
  authors: readonly string[]
  /** Venue labels in display order; a conference + its journal extension is one entry. */
  venues: readonly string[]
  year: number
  topics: readonly string[]
  image?: string
  summary?: string
  links: readonly PublicationLink[]
}

export type PublicationData = {
  topics: readonly TopicEntry[]
  publications: readonly Publication[]
}

// Singular, matching the `[[topic]]` / `[[publication]]` tables in the file.
const ROOT_KEYS = ['topic', 'publication']
const TOPIC_KEYS = ['id', 'en', 'zh']
const PUBLICATION_KEYS = [
  'id',
  'title',
  'authors',
  'venues',
  'year',
  'topics',
  'image',
  'summary',
  'links',
]
const MIN_YEAR = 1900
const MAX_YEAR = 2100

function isLinkUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://') || value.startsWith('/')
}

export function parsePublicationData(
  raw: unknown,
  label = 'publications.toml',
): PublicationData {
  const problems: string[] = []
  const fail = (where: string, message: string) => {
    problems.push(`${where}: ${message}`)
  }

  if (!isRecord(raw)) {
    throw new Error(`${label} 的顶层必须是一张表（table）`)
  }

  const checkKeys = (record: Record<string, unknown>, allowed: readonly string[], where: string) => {
    for (const key of Object.keys(record)) {
      if (!allowed.includes(key)) {
        fail(where, `未知字段 "${key}"（允许：${allowed.join(', ')}）`)
      }
    }
  }

  // Catches a misspelled table name (`[[publication]]` instead of
  // `[[publications]]`), which would otherwise just look like an empty list.
  checkKeys(raw, ROOT_KEYS, '顶层')

  // --- topics ---------------------------------------------------------------
  const topics: TopicEntry[] = []
  const topicIds = new Set<string>()
  const rawTopics = raw.topic ?? []

  if (!Array.isArray(rawTopics)) {
    fail('topic', '必须是数组（每一项用 [[topic]] 声明）')
  } else {
    rawTopics.forEach((value, index) => {
      const where = `topic[${index}]`
      if (!isRecord(value)) {
        fail(where, '必须是一张表（用 [[topic]] 声明）')
        return
      }
      checkKeys(value, TOPIC_KEYS, where)

      const id = readString(value.id)
      const en = readString(value.en)
      const zh = readString(value.zh)

      if (!id) fail(where, '缺少非空的 "id"')
      else if (topicIds.has(id)) fail(where, `方向 id "${id}" 重复`)
      else topicIds.add(id)

      if (!en) fail(where, '缺少非空的 "en"（英文筛选按钮上的名字）')
      if (!zh) fail(where, '缺少非空的 "zh"（中文筛选按钮上的名字）')

      if (id && en && zh) topics.push({ id, en, zh })
    })
  }

  // --- publications ---------------------------------------------------------
  const publications: Publication[] = []
  const rawPublications = raw.publication ?? []
  const publicationIds = new Map<string, number>()

  if (!Array.isArray(rawPublications)) {
    fail('publication', '必须是数组（每一项用 [[publication]] 声明）')
  } else {
    rawPublications.forEach((value, index) => {
      const where = `publication[${index}]`
      if (!isRecord(value)) {
        fail(where, '必须是一张表（用 [[publication]] 声明）')
        return
      }
      checkKeys(value, PUBLICATION_KEYS, where)

      const id = readString(value.id)
      if (!id) {
        fail(where, '缺少非空的 "id"')
      } else {
        const seenAt = publicationIds.get(id)
        if (seenAt !== undefined) fail(where, `论文 id "${id}" 与 publication[${seenAt}] 重复`)
        else publicationIds.set(id, index)
      }
      const knownId = id ?? `publication[${index}]`

      const title = readString(value.title)
      if (!title) fail(knownId, '缺少非空的 "title"')

      const authors = Array.isArray(value.authors) ? value.authors : null
      if (!authors || authors.length === 0) {
        fail(knownId, '"authors" 必须是非空字符串数组，如 ["Alice Zhang", "Bob Li"]')
      } else {
        authors.forEach((author, authorIndex) => {
          if (!readString(author)) {
            fail(`${knownId}.authors[${authorIndex}]`, '必须是非空字符串')
          }
        })
      }

      const venues = Array.isArray(value.venues) ? value.venues : null
      const venueLabels: string[] = []
      if (!venues || venues.length === 0) {
        fail(knownId, '"venues" 必须是非空字符串数组，如 venues = ["CVPR 2026"]')
      } else {
        venues.forEach((label, labelIndex) => {
          const text = readString(label)
          if (!text) fail(`${knownId}.venues[${labelIndex}]`, '必须是非空字符串')
          else venueLabels.push(text)
        })
      }

      const year =
        typeof value.year === 'number' && Number.isInteger(value.year) ? value.year : null
      if (year === null) fail(knownId, '"year" 必须是整数年份')
      else if (year < MIN_YEAR || year > MAX_YEAR) fail(knownId, `"year" 看起来不对：${year}`)

      const topicsOfEntry: string[] = []
      if (!Array.isArray(value.topics) || value.topics.length === 0) {
        fail(knownId, `"topics" 必须是非空数组，如 ["${[...topicIds][0] ?? '3d-vision'}"]`)
      } else {
        value.topics.forEach((topic) => {
          const topicId = readString(topic)
          if (!topicId) {
            fail(`${knownId}.topics`, '每一项都必须是非空字符串')
          } else if (!topicIds.has(topicId)) {
            const known = topicIds.size > 0 ? `（已声明：${[...topicIds].join(', ')}）` : '（文件里还没有 [[topic]] 声明）'
            fail(knownId, `"topics" 引用了未声明的方向 "${topicId}"${known}`)
          } else if (!topicsOfEntry.includes(topicId)) {
            topicsOfEntry.push(topicId)
          }
        })
      }

      const image = value.image === undefined ? undefined : (readString(value.image) ?? undefined)
      if (value.image !== undefined && image === undefined) {
        fail(`${knownId}.image`, '必须是非空字符串，如 "/publications/xxx.webp"')
      }

      const summary =
        value.summary === undefined ? undefined : (readString(value.summary) ?? undefined)
      if (value.summary !== undefined && summary === undefined) {
        fail(`${knownId}.summary`, '必须是非空字符串')
      }

      const links: PublicationLink[] = []
      if (value.links !== undefined) {
        if (!isRecord(value.links)) {
          fail(`${knownId}.links`, '必须是一张内联表，如 links = { paper = "https://…" }')
        } else {
          for (const [kind, href] of Object.entries(value.links)) {
            if (!(LINK_KINDS as readonly string[]).includes(kind)) {
              fail(`${knownId}.links`, `未知的链接类型 "${kind}"（允许：${LINK_KINDS.join(', ')}）`)
              continue
            }
            const url = readString(href)
            if (!url) fail(`${knownId}.links.${kind}`, '必须是非空字符串')
            else if (!isLinkUrl(url)) fail(`${knownId}.links.${kind}`, `"${url}" 不像链接（需要 http(s):// 或 / 开头）`)
            else links.push({ kind: kind as LinkKind, href: url })
          }
        }
      }

      // Pushed even when fields are missing: `problems` is non-empty then, so the
      // throw below fires and these placeholder values never escape.
      publications.push({
        id: knownId,
        title: title ?? '',
        authors: authors ?? [],
        venues: venueLabels,
        year: year ?? 0,
        topics: topicsOfEntry,
        image,
        summary,
        links,
      })
    })
  }

  reportProblems(problems, label)

  return { topics, publications }
}
