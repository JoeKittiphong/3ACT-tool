import { Button } from './Button.jsx'
import { ModalShell } from './ModalShell.jsx'

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <ModalShell
      eyebrow="Confirm Action"
      title={title}
      description={description}
      onClose={onCancel}
      contentClassName="confirm-body"
      actions={
        <div className="modal-actions desktop-modal-actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" className="danger-button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      }
      mobileActions={
        <div className="mobile-settings-bar">
          <Button variant="secondary" className="mobile-settings-button" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            className="mobile-settings-button danger-button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="confirm-copy">การกระทำนี้ลบข้อมูลของเรื่องนี้ออกจากเครื่องและบัญชี sync</p>
    </ModalShell>
  )
}
