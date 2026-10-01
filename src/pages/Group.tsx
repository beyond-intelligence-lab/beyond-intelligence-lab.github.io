import PageHeader from '../components/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'

export default function Group() {
  const { t } = useI18n()
  usePageMeta(t.nav.group)

  return (
    <>
      <PageHeader title={t.nav.group} />
      {/* Content goes here. */}
    </>
  )
}
