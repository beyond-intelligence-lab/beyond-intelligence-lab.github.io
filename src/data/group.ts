import type { Localized } from '../i18n/types'

export type GroupMember = {
  id: string
  name: Localized
  role: Localized
  /** Optional free-form heading to group people under, e.g. Faculty / Alumni. */
  section?: Localized
  focus?: Localized
  initials: string
  links?: readonly { label: Localized; href: string }[]
}

/** Empty until there are people to list. */
export const GROUP_MEMBERS: readonly GroupMember[] = []
