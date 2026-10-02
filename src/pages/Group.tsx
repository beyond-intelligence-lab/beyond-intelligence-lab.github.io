import MemberCard from '../components/MemberCard'
import PageHeader from '../components/PageHeader'
import { InfoIcon } from '../components/icons'
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
  const currentSections = sections.filter((section) => !section.id.startsWith('alumni'))
  const alumniSections = sections.filter((section) => section.id.startsWith('alumni'))

  return (
    <>
      <PageHeader title={t.nav.group} />
      <section className="section group-page">
        <div className="container">
          {/* Info-level callout: shown whether or not there are members to
              list, so the invitation is never the thing that goes missing.
              Outside the grid below — it is not a group, and the grid's own
              spacing would leave it floating. */}
          <aside className="join-callout">
            <InfoIcon className="join-callout__icon" />
            <div>
              <p className="join-callout__title">{t.group.join.title}</p>
              <p className="join-callout__body">{t.group.join.body}</p>
            </div>
          </aside>

          <div className="group">
            {currentSections.map((section) => (
              <div key={section.id}>
                <h2 className="group__title">{t.group[section.id]}</h2>
                <ul className="group__list">
                  {section.members.map((member) => (
                    <MemberCard key={member.en} member={member} />
                  ))}
                </ul>
              </div>
            ))}
            {alumniSections.length > 0 && (
              <div>
                <h2 className="group__title">{t.group.alumni}</h2>
                <div className="group__alumni">
                  {alumniSections.map((section) => (
                    <div key={section.id}>
                      <h3 className="group__subtitle">{t.group[section.id]}</h3>
                      <ul className="group__list">
                        {section.members.map((member) => (
                          <MemberCard key={member.en} member={member} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
