import { Button } from './Button.jsx'
import { Card } from './Card.jsx'

export function ModalShell({
  eyebrow,
  title,
  description,
  onClose,
  className = '',
  contentClassName = '',
  actions,
  mobileActions,
  children,
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <Card
        as="section"
        className={`settings-modal ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-shell-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="modal-shell-title">{title}</h2>
            {description ? <p className="modal-copy">{description}</p> : null}
          </div>
          <Button variant="secondary" className="modal-close" onClick={onClose}>
            ปิด
          </Button>
        </div>

        <div className={contentClassName}>{children}</div>

        {actions}
        {mobileActions}
      </Card>
    </div>
  )
}
