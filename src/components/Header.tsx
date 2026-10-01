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
          {/* The app icon ships in a light and a dark cut, so the mark follows
              whichever theme is active. Decorative: the brand text sits beside
              it and the link already carries an aria-label. */}
          <img
            className="header__mark"
            src={theme === 'dark' ? '/app-icon-dark-192.png' : '/app-icon-light-192.png'}
            alt=""
            width={30}
            height={30}
          />
          <span className="header__brand-text">{t.site.name}</span>
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
