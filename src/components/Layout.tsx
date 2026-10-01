import { Outlet, ScrollRestoration } from 'react-router-dom'

import { useI18n } from '../i18n'
import Footer from './Footer'
import Header from './Header'
import './Layout.css'

export default function Layout() {
  const { t } = useI18n()

  return (
    <div className="layout">
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <Header />
      <main id="main" className="layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
