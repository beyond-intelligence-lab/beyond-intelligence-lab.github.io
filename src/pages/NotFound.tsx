import { Link } from 'react-router-dom'

import { ArrowRightIcon } from '../components/icons'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import './NotFound.css'

export default function NotFound() {
  const { t } = useI18n()
  usePageMeta(t.notFound.title)

  return (
    <section className="section notfound">
      <div className="container notfound__inner">
        <p className="notfound__code" aria-hidden="true">
          {t.notFound.code}
        </p>
        <h1 className="notfound__title">{t.notFound.title}</h1>
        <p className="notfound__actions">
          <Link className="button button--primary" to="/publications">
            {t.nav.publications}
            <ArrowRightIcon />
          </Link>
        </p>
      </div>
    </section>
  )
}
