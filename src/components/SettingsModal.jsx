import { Button } from './ui/Button.jsx'
import { ModalShell } from './ui/ModalShell.jsx'
import { TextAreaField } from './ui/TextAreaField.jsx'
import { TextField } from './ui/TextField.jsx'

export function SettingsModal({ isOpen, project, onClose, onCreateNew, onFieldChange }) {
  if (!isOpen) return null

  return (
    <ModalShell
      eyebrow="Story Setup"
      title="ตั้งค่าเรื่องย่อ"
      description="กำหนดข้อมูลตั้งต้นของเรื่องก่อน แล้วค่อยลงรายละเอียดในแต่ละ point"
      onClose={onClose}
      contentClassName="field-grid"
      actions={
        <div className="modal-actions desktop-modal-actions">
          <Button variant="secondary" onClick={onCreateNew}>
            เริ่มเรื่องใหม่
          </Button>
          <Button variant="primary" onClick={onClose}>
            บันทึกและเริ่มเขียน
          </Button>
        </div>
      }
      mobileActions={
        <div className="mobile-settings-bar">
          <Button variant="secondary" className="mobile-settings-button" onClick={onCreateNew}>
            เริ่มใหม่
          </Button>
          <Button variant="primary" className="mobile-settings-button" onClick={onClose}>
            บันทึก
          </Button>
        </div>
      }
    >
      <TextField
        label="ชื่อเรื่อง"
        value={project.title}
        onChange={(event) => onFieldChange('title', event.target.value)}
        placeholder="ชื่อโปรเจกต์หรือชื่อเรื่อง"
      />
      <TextField
        label="แนวเรื่อง"
        value={project.genre}
        onChange={(event) => onFieldChange('genre', event.target.value)}
        placeholder="แฟนตาซี, โรแมนติก, สืบสวน..."
      />
      <TextField
        className="wide"
        label="ธีมหลัก"
        value={project.theme}
        onChange={(event) => onFieldChange('theme', event.target.value)}
        placeholder="เรื่องนี้อยากพูดถึงอะไร"
      />
      <TextAreaField
        className="wide"
        label="Logline"
        value={project.logline}
        onChange={(event) => onFieldChange('logline', event.target.value)}
        placeholder="สรุปเรื่อง 1-2 ประโยค"
        rows={4}
      />
    </ModalShell>
  )
}
