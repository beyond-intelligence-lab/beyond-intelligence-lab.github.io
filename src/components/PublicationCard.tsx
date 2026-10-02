import { useId, useState } from 'react'
import type { ComponentType } from 'react'

import { venueInfo, venueKind } from '../data/publications'
import type { LinkKind, Publication } from '../data/publications'
import { useI18n } from '../i18n'
import { CodeIcon, ExternalLinkIcon, FileTextIcon, SlidesIcon } from './icons'
import type { IconProps } from './icons'
import './PublicationCard.css'

const LINK_ICONS: Record<LinkKind, ComponentType<IconProps>> = {
  paper: FileTextIcon,
  code: CodeIcon,
  project: ExternalLinkIcon,
  slides: SlidesIcon,
  arxiv: FileTextIcon,
}

type PublicationCardProps = {
  publication: Publication
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  const { t } = useI18n()
  const tooltipPrefix = useId()
  const [dismissedVenue, setDismissedVenue] = useState<string | null>(null)

  return (
    <li className="publication">
      {/* Decorative: the title sits right next to it. */}
      {publication.image ? (
        <div className="publication__media">
          <img src={publication.image} alt="" loading="lazy" decoding="async" />
        </div>
      ) : (
        <div className="publication__media publication__media--empty" aria-hidden="true">
          <FileTextIcon />
        </div>
      )}

      <div className="publication__content">
        {/* Conference + journal extension of the same work show side by side,
            colour-coded by kind. */}
        <div className="publication__venues">
          {publication.venues.map((venue, index) => {
            const info = venueInfo(venue)
            const tooltipId = `${tooltipPrefix}-venue-${index}`
            return (
              <div key={venue} className={`publication__venue-group publication__venue-group--${venueKind(venue)}`}>
                <span
                  className="publication__venue"
                  tabIndex={info ? 0 : undefined}
                  aria-describedby={info ? tooltipId : undefined}
                  data-tooltip-dismissed={dismissedVenue === venue || undefined}
                  onMouseEnter={() => setDismissedVenue(null)}
                  onFocus={() => setDismissedVenue(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setDismissedVenue(venue)
                  }}
                >
                  {venue}
                  {info ? (
                    <span id={tooltipId} role="tooltip" className="publication__tooltip">
                      {info.fullName}
                    </span>
                  ) : null}
                </span>
                {info?.ccf ? <span className="publication__ccf">CCF {info.ccf}</span> : null}
              </div>
            )
          })}
        </div>
        <h4 className="publication__title">{publication.title}</h4>
        <p className="publication__authors">{publication.authors.join(', ')}</p>

        {publication.links.length > 0 ? (
          <ul className="publication__links">
            {publication.links.map((link) => {
              const Icon = LINK_ICONS[link.kind]
              return (
                <li key={link.kind}>
                  <a
                    className="button button--ghost publication__link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                    {t.publications.links[link.kind]}
                    <span className="visually-hidden">（{t.a11y.newTab}）</span>
                  </a>
                </li>
              )
            })}
          </ul>
        ) : null}

        {publication.summary ? (
          <p className="publication__summary">{publication.summary}</p>
        ) : null}
      </div>
    </li>
  )
}
