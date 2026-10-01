import raw from './group.toml'
import { GROUP_SECTION_IDS, parseGroupData } from './group-schema'
import type { GroupSectionId, Member } from './group-schema'

export type { GroupSectionId, Member } from './group-schema'

const data = parseGroupData(raw, 'src/data/group.toml')

/** Sections in display order; the page skips the ones without members. */
export const GROUP_SECTIONS: readonly { id: GroupSectionId; members: readonly Member[] }[] =
  GROUP_SECTION_IDS.map((id) => ({ id, members: data[id] }))
