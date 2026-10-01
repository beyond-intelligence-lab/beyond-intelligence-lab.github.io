import en from './en.json'
import zh from './zh.json'
import type { Locale } from './types'

/**
 * English is the source of truth for the message shape: `Messages` is inferred
 * from `en.json` and every other locale is checked against it, so a key added
 * to one language and forgotten in the other is a compile error rather than a
 * blank spot on the page.
 *
 * Only structural strings live in the JSON — nav labels, control labels,
 * chrome. Page copy goes in the page components.
 *
 * The link vocabulary (`paper` / `code` / …) is checked where it is used:
 * `t.publications.links[link.kind]` in `PublicationCard` fails to type-check if
 * a `LinkKind` has no label here.
 */
export type Messages = typeof en

// The annotation is the check: a key missing from zh.json fails here by name.
export const DICTIONARIES: Record<Locale, Messages> = { en, zh }
