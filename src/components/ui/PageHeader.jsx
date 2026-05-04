export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="reader-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="reader-meta">{description}</p> : null}
      </div>
      {actions ? <div className="reader-actions">{actions}</div> : null}
    </div>
  )
}
