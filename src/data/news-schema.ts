/**
 * Validation for `news.toml`.
 *
 * Same reasoning as `publication-schema.ts`: the table name is `[[news]]`, and
 * a misspelled one (`[[item]]`, `[[News]]`) would otherwise just look like an
 * empty list. Every problem is collected before throwing, so one run reports
 * all the mistakes rather than only the first.
 *
 * `date` is month precision by default (`2026-08`), because announcements are
 * usually "this month" rather than a day; `2026-08-26` is accepted when the day
 * is worth recording.
 *
 * Kept dependency-free so `vite.config.ts` can call it at build time too: bad
 * data then fails `pnpm build` (and CI) instead of the browser.
 */

// Explicit extension: this module is also pulled into the node project (via
// `vite.config.ts`), whose nodenext resolution requires it. Both tsconfigs
// allow `.ts` imports, and Vite resolves them as usual.
import { isRecord, readString, reportProblems } from './schema-utils.ts'

export type NewsItem = {
  id: string
  /**
   * `YYYY-MM`, or `YYYY-MM-DD` when the day matters. Deliberately a string
   * rather than a TOML date: a real date becomes an instant, and an instant
   * formats to a different day depending on the reader's timezone.
   */
  date: string
  /** Displayed while the UI is in English. */
  en: string
  /** Displayed while the UI is in Chinese. */
  zh: string
  /** Optional page the entry points at. */
  link?: string
}

export type NewsData = {
  news: readonly NewsItem[]
}

// Singular, matching the `[[news]]` table in the file.
const ROOT_KEYS = ['news']
const NEWS_KEYS = ['id', 'date', 'en', 'zh', 'link']

const DATE_PATTERN = /^\d{4}-\d{2}(-\d{2})?$/

/** Rejects `2026-13`, `2026-02-31` and friends, which `Date` would roll over. */
function isRealDate(value: string): boolean {
  const [, month, day] = value.split('-')
  if (Number(month) < 1 || Number(month) > 12) return false
  if (day === undefined) return true
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function isLinkUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://') || value.startsWith('/')
}

export function parseNewsData(raw: unknown, label = 'news.toml'): NewsData {
  const problems: string[] = []
  const fail = (where: string, message: string) => {
    problems.push(`${where}: ${message}`)
  }

  if (!isRecord(raw)) {
    throw new Error(`${label} 的顶层必须是一张表（table）`)
  }

  // Catches a misspelled table name, which would otherwise look like no news.
  for (const key of Object.keys(raw)) {
    if (!ROOT_KEYS.includes(key)) {
      fail('顶层', `未知字段 "${key}"（允许：${ROOT_KEYS.join(', ')}）`)
    }
  }

  const news: NewsItem[] = []
  const rawNews = raw.news ?? []
  const seenIds = new Map<string, number>()

  if (!Array.isArray(rawNews)) {
    fail('news', '必须是数组（每一条用 [[news]] 声明）')
  } else {
    rawNews.forEach((value, index) => {
      const where = `news[${index}]`
      if (!isRecord(value)) {
        fail(where, '必须是一张表（用 [[news]] 声明）')
        return
      }
      for (const key of Object.keys(value)) {
        if (!NEWS_KEYS.includes(key)) {
          fail(where, `未知字段 "${key}"（允许：${NEWS_KEYS.join(', ')}）`)
        }
      }

      const id = readString(value.id)
      if (!id) {
        fail(where, '缺少非空的 "id"')
      } else {
        const seenAt = seenIds.get(id)
        if (seenAt !== undefined) fail(where, `id "${id}" 与 news[${seenAt}] 重复`)
        else seenIds.set(id, index)
      }
      const knownId = id ?? `news[${index}]`

      const date = readString(value.date)
      if (!date) {
        fail(knownId, '缺少 "date"，格式 "2026-08"（需要精确到日时写 "2026-08-26"）')
      } else if (!DATE_PATTERN.test(date)) {
        fail(knownId, `"date" 要写成 "2026-08" 或 "2026-08-26"，现在是 "${date}"`)
      } else if (!isRealDate(date)) {
        fail(knownId, `"date" 不是一个真实日期："${date}"`)
      }

      const en = readString(value.en)
      const zh = readString(value.zh)
      if (!en) fail(knownId, '缺少非空的 "en"（英文界面显示的文字）')
      if (!zh) fail(knownId, '缺少非空的 "zh"（中文界面显示的文字）')

      let link: string | undefined
      if (value.link !== undefined) {
        link = readString(value.link) ?? undefined
        if (link === undefined) {
          fail(`${knownId}.link`, '必须是非空字符串')
        } else if (!isLinkUrl(link)) {
          fail(`${knownId}.link`, `"${link}" 不像链接（需要 http(s):// 或 / 开头）`)
        }
      }

      // Pushed even when fields are missing: `problems` is non-empty then, so
      // the throw below fires and these placeholder values never escape.
      news.push({ id: knownId, date: date ?? '', en: en ?? '', zh: zh ?? '', link })
    })
  }

  reportProblems(problems, label)

  return { news }
}
