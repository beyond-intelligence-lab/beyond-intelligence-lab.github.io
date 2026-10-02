/**
 * Validation for `group.toml`.
 *
 * Same reasoning as `publication-schema.ts`: the table name is the section
 * (`[[teacher]]`, `[[phdStudent]]`, …), so a misspelled one would otherwise
 * look like an empty section, and every problem is collected before throwing.
 *
 * Kept dependency-free so `vite.config.ts` can call it at build time too.
 */

// Explicit extension — see the note in `publication-schema.ts`.
import { isRecord, readString, reportProblems } from './schema-utils.ts'

export const GROUP_SECTION_IDS = [
  'teacher',
  'phdStudent',
  'masterStudent',
  'alumniPhd',
  'alumniMaster',
] as const

export type GroupSectionId = (typeof GROUP_SECTION_IDS)[number]

export type Member = {
  /** Displayed while the UI is in English. */
  en: string
  /** Displayed while the UI is in Chinese. */
  zh: string
  /** Site-absolute path under `public/`; without it the card shows initials. */
  avatar?: string
  /** Personal page — http(s) or a site path. The name becomes a link. */
  homepage?: string
}

export type GroupData = Record<GroupSectionId, readonly Member[]>

const MEMBER_KEYS = ['en', 'zh', 'avatar', 'homepage']

export function parseGroupData(raw: unknown, label = 'group.toml'): GroupData {
  const problems: string[] = []
  const fail = (where: string, message: string) => {
    problems.push(`${where}: ${message}`)
  }

  if (!isRecord(raw)) {
    throw new Error(`${label} 的顶层必须是一张表（table）`)
  }

  // Catches a misspelled section table (`[[phd]]`, `[[phds]]`), which would
  // otherwise just look like an empty section.
  for (const key of Object.keys(raw)) {
    if (!(GROUP_SECTION_IDS as readonly string[]).includes(key)) {
      fail('顶层', `未知分组 "${key}"（允许：${GROUP_SECTION_IDS.join(', ')}）`)
    }
  }

  const sections = {} as Record<GroupSectionId, Member[]>

  for (const id of GROUP_SECTION_IDS) {
    const members: Member[] = []
    const list = raw[id] ?? []

    if (!Array.isArray(list)) {
      fail(id, `必须是数组（每个人用 [[${id}]] 声明）`)
    } else {
      list.forEach((value, index) => {
        const where = `${id}[${index}]`
        if (!isRecord(value)) {
          fail(where, `必须是一张表（用 [[${id}]] 声明）`)
          return
        }
        for (const key of Object.keys(value)) {
          if (!MEMBER_KEYS.includes(key)) {
            fail(where, `未知字段 "${key}"（允许：${MEMBER_KEYS.join(', ')}）`)
          }
        }

        const en = readString(value.en)
        const zh = readString(value.zh)
        if (!en) fail(where, '缺少非空的 "en"（英文名）')
        if (!zh) fail(where, '缺少非空的 "zh"（中文名）')

        let avatar: string | undefined
        if (value.avatar !== undefined) {
          avatar = readString(value.avatar) ?? undefined
          if (avatar === undefined) {
            fail(`${where}.avatar`, '必须是非空字符串，如 "/images/avatars/xxx.webp"')
          } else if (!avatar.startsWith('/') && !avatar.startsWith('http')) {
            fail(`${where}.avatar`, `"${avatar}" 应是站点绝对路径（/images/avatars/…）或 http(s) 链接`)
          }
        }

        let homepage: string | undefined
        if (value.homepage !== undefined) {
          homepage = readString(value.homepage) ?? undefined
          if (homepage === undefined) {
            fail(`${where}.homepage`, '必须是非空字符串，如 "https://example.com"')
          } else if (!homepage.startsWith('/') && !homepage.startsWith('http')) {
            fail(`${where}.homepage`, `"${homepage}" 应是 http(s) 链接或站点路径（/…）`)
          }
        }

        if (en && zh) members.push({ en, zh, avatar, homepage })
      })
    }

    sections[id] = members
  }

  reportProblems(problems, label)
  return sections
}
