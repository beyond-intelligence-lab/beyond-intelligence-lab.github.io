import PageHeader from '../components/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'

export default function Home() {
  const { t } = useI18n()
  usePageMeta(t.nav.home)

  return (
    <>
      <PageHeader title={t.nav.home} />
      {/* Content goes here. */}
    </>
  )
}
