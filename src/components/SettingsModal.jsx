export function SettingsModal({ isOpen, project, onClose, onCreateNew, onFieldChange }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-settings-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Story Setup</p>
            <h2 id="story-settings-title">ตั้งค่าเรื่องย่อ</h2>
            <p className="modal-copy">
              กำหนดข้อมูลตั้งต้นของเรื่องก่อน แล้วค่อยลงรายละเอียดในแต่ละ point
            </p>
          </div>
          <button className="secondary-button modal-close" type="button" onClick={onClose}>
            ปิด
          </button>
        </div>

        <div className="field-grid">
          <label>
            <span>ชื่อเรื่อง</span>
            <input
              value={project.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
              placeholder="ชื่อโปรเจกต์หรือชื่อเรื่อง"
            />
          </label>
          <label>
            <span>แนวเรื่อง</span>
            <input
              value={project.genre}
              onChange={(event) => onFieldChange('genre', event.target.value)}
              placeholder="แฟนตาซี, โรแมนติก, สืบสวน..."
            />
          </label>
          <label className="wide">
            <span>ธีมหลัก</span>
            <input
              value={project.theme}
              onChange={(event) => onFieldChange('theme', event.target.value)}
              placeholder="เรื่องนี้อยากพูดถึงอะไร"
            />
          </label>
          <label className="wide">
            <span>Logline</span>
            <textarea
              value={project.logline}
              onChange={(event) => onFieldChange('logline', event.target.value)}
              placeholder="สรุปเรื่อง 1-2 ประโยค"
              rows={4}
            />
          </label>
        </div>

        <div className="modal-actions desktop-modal-actions">
          <button className="secondary-button" type="button" onClick={onCreateNew}>
            เริ่มเรื่องใหม่
          </button>
          <button className="primary-button" type="button" onClick={onClose}>
            บันทึกและเริ่มเขียน
          </button>
        </div>

        <div className="mobile-settings-bar">
          <button className="secondary-button mobile-settings-button" type="button" onClick={onCreateNew}>
            เริ่มใหม่
          </button>
          <button className="primary-button mobile-settings-button" type="button" onClick={onClose}>
            บันทึก
          </button>
        </div>
      </section>
    </div>
  )
}
