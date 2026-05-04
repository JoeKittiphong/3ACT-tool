import { Button } from './ui/Button.jsx'
import { PageHeader } from './ui/PageHeader.jsx'

export function SynopsisReader({
  synopsis,
  completedCount,
  showPointTitles,
  onTogglePointTitles,
  onBack,
  onCopy,
}) {
  return (
    <>
      <div className="reader-shell mobile-action-shell">
        <div className="reader-card synopsis-reader-card">
          <PageHeader title="เรื่องย่อรวม" description={`${completedCount} sections ready`} />

          <div className="reader-toolbar">
            <Button variant="secondary" className="reader-toggle-button" onClick={onTogglePointTitles}>
              {showPointTitles ? 'ซ่อนหัวข้อ point' : 'แสดงหัวข้อ point'}
            </Button>
          </div>

          <pre className="reader-output">{synopsis || 'ยังไม่มีเนื้อหาสำหรับรวมเป็นเรื่องย่อ'}</pre>
        </div>
      </div>

      <div className="mobile-bottom-bar mobile-action-bar reader-bottom-bar">
        <div className="mobile-bottom-actions reader-mobile-actions">
          <Button variant="secondary" className="mobile-bottom-button" onClick={onTogglePointTitles}>
            {showPointTitles ? 'ซ่อนหัวข้อ' : 'แสดงหัวข้อ'}
          </Button>
          <Button variant="primary" className="mobile-bottom-button" onClick={onCopy}>
            คัดลอก
          </Button>
          <Button variant="secondary" className="mobile-bottom-button" onClick={onBack}>
            กลับไปเขียน
          </Button>
        </div>
      </div>
    </>
  )
}
