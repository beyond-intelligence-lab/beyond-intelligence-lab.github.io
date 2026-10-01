import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { NAV_ITEMS } from '../data/site'
import { useTheme } from '../hooks/useTheme'
import { useI18n } from '../i18n'
import { LOCALE_LABELS, LOCALES } from '../i18n/types'
import { CloseIcon, GlobeIcon, MenuIcon, MoonIcon, SunIcon } from './icons'
import './Header.css'

export default function Header() {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const nextLocale = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length]

  return (
    <header className="header">
      <div className="container header__inner">
        <Link className="header__brand" to="/" aria-label={t.site.name} onClick={closeMenu}>
          <span className="header__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <g stroke="currentColor" strokeWidth="1.6" opacity=".7" fill="none">
                <path d="M10 11l6-3 6 3M10 11l-3 7 9 3 9-3-3-7M10 21l6 3 6-3" />
              </g>
              <g fill="currentColor">
                <circle cx="16" cy="8" r="2.6" />
                <circle cx="7" cy="18" r="2.6" />
                <circle cx="16" cy="24" r="2.6" />
                <circle cx="25" cy="18" r="2.6" />
              </g>
            </svg>
          </span>
          <span className="header__brand-text">
            <strong>Beyond Intelligence</strong>
            <span>Lab</span>
          </span>
        </Link>

        <nav
          id="site-nav"
          className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}
          aria-label={t.site.name}
        >
          <ul className="header__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `header__link${isActive ? ' header__link--active' : ''}`
                  }
                >
                  {t.nav[item.labelKey]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => setLocale(nextLocale)}
            title={`${t.a11y.toggleLanguage}: ${LOCALE_LABELS[nextLocale]}`}
            aria-label={`${t.a11y.toggleLanguage}: ${LOCALE_LABELS[nextLocale]}`}
          >
            <GlobeIcon />
            <span className="icon-button__text">{LOCALE_LABELS[locale]}</span>
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            title={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            className="icon-button icon-button--menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
