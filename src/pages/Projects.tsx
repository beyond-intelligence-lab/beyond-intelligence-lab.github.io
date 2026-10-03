import PageHeader from '../components/PageHeader'
import { ConstructionIcon } from '../components/icons'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import './Projects.css'

export default function Projects() {
  const { t } = useI18n()
  usePageMeta(t.nav.projects)

  return (
    <>
      <PageHeader title={t.nav.projects} />
      <section className="section projects-page">
        <div className="container">
          <aside className="projects-callout">
            <ConstructionIcon className="projects-callout__icon" />
            <p>{t.projects.placeholder}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
