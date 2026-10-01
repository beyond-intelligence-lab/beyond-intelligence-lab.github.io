import raw from './news.toml'
import { parseNewsData } from './news-schema'
import type { NewsItem } from './news-schema'

export type { NewsItem } from './news-schema'

const data = parseNewsData(raw, 'src/data/news.toml')

/**
 * Newest first. `date` is an ISO `YYYY-MM-DD` string, so a plain string compare
 * orders it without any timezone entering the picture; `sort` is stable, so
 * entries sharing a date keep their file order.
 */
export const NEWS_ITEMS: readonly NewsItem[] = [...data.news].sort((a, b) =>
  b.date.localeCompare(a.date),
)
