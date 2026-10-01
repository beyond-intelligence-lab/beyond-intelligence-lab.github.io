import MemberCard from '../components/MemberCard'
import PageHeader from '../components/PageHeader'
import { GROUP_SECTIONS } from '../data/group'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import './Group.css'

export default function Group() {
  const { t } = useI18n()
  usePageMeta(t.nav.group)

  // Empty sections are not rendered at all, so the page is exactly what
  // `group.toml` contains.
  const sections = GROUP_SECTIONS.filter((section) => section.members.length > 0)

  return (
    <>
      <PageHeader title={t.nav.group} />
      {sections.length > 0 ? (
        <section className="section">
          <div className="container group">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="group__title">{t.group[section.id]}</h2>
                <ul className="group__list">
                  {section.members.map((member) => (
                    <MemberCard key={member.en} member={member} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
