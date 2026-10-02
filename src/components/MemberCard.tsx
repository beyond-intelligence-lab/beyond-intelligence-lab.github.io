import { Link } from 'react-router-dom'

import type { Member } from '../data/group'
import { useI18n } from '../i18n'
import './MemberCard.css'

/** "Chaoyue Niu" → "CN", for members who have no portrait yet. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function MemberCard({ member }: { member: Member }) {
  const { t, locale } = useI18n()
  const name = member[locale]
  const { homepage } = member

  return (
    <li className="member">
      {member.avatar ? (
        <img className="member__avatar" src={member.avatar} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="member__avatar member__avatar--empty" aria-hidden="true">
          {initialsOf(member.en)}
        </span>
      )}

      {/* With a homepage the name becomes the link — a site path routes
          client-side, anything else opens in a new tab. */}
      {homepage === undefined ? (
        <p className="member__name">{name}</p>
      ) : homepage.startsWith('/') ? (
        <Link className="member__name member__name--link" to={homepage}>
          {name}
        </Link>
      ) : (
        <a
          className="member__name member__name--link"
          href={homepage}
          target="_blank"
          rel="noreferrer"
        >
          {name}
          <span className="visually-hidden">（{t.a11y.newTab}）</span>
        </a>
      )}
      {member.firstPosition ? (
        <p className="member__desc">{member.firstPosition[locale]}</p>
      ) : null}
    </li>
  )
}
