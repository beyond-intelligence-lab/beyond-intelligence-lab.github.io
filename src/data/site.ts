import type { Messages } from '../i18n'

export type NavItem = {
  to: string
  /** Key into `t.nav`, so the label follows the active language. */
  labelKey: keyof Messages['nav']
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/home', labelKey: 'home' },
  { to: '/publications', labelKey: 'publications' },
  { to: '/projects', labelKey: 'projects' },
  { to: '/group', labelKey: 'group' },
]
