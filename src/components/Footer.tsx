import { useI18n } from '../i18n'
import './Footer.css'

// Resolved once when the module loads, so render stays free of side effects.
const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__copyright">
          {t.footer.copyright.replace('{year}', String(CURRENT_YEAR))}
        </p>
      </div>
    </footer>
  )
}
