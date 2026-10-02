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
              <p className="join-callout__title">
                <span lang="en">Welcome to Join Us</span>
                {' / '}
                <span lang="zh-CN">欢迎加入我们</span>
              </p>
              <div className="join-callout__language" lang="en">
                <p className="join-callout__body">
                  We keep seeking for strong and self-motivated <strong>PhD students</strong>,{' '}
                  <strong>master students</strong>, and <strong>undergraduate interns</strong>.
                </p>
                <p className="join-callout__body">
                  Interested in on-device intelligence and large–small model collaboration for agents,
                  recommendation, or multimodal interaction and understanding? Contact me via email at{' '}
                  <a href="mailto:rvince@sjtu.edu.cn">rvince@sjtu.edu.cn</a>.
                </p>
              </div>
              <div className="join-callout__language" lang="zh-CN">
                <p className="join-callout__body">
                  课题组长期招收优秀且自驱力强的<strong>博士生</strong>、<strong>硕士生</strong>
                  与<strong>本科生实习生</strong>。
                </p>
                <p className="join-callout__body">
                  如果你对端侧智能、大小模型协同及其在智能体、推荐系统和多模态交互与理解中的应用感兴趣，欢迎邮件联系我（
                  <a href="mailto:rvince@sjtu.edu.cn">rvince@sjtu.edu.cn</a>）。
                </p>
              </div>
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
