import './PageHeader.css'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  lead?: string
}

export default function PageHeader({ eyebrow, title, lead }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="page-header__title">{title}</h1>
        {lead ? <p className="page-header__lead">{lead}</p> : null}
      </div>
    </header>
  )
}
