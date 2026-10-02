import PageHeader from '../components/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import './Projects.css'

export default function Projects() {
  const { t } = useI18n()
  usePageMeta(t.nav.projects)

  return (
    <>
      <PageHeader title={t.nav.projects} />
      <section className="section">
        <div className="container">
          <p className="projects__placeholder">{t.projects.placeholder}</p>
        </div>
      </section>
    </>
  )
}
