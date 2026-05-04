import { Button } from './ui/Button.jsx'
import { PageHeader } from './ui/PageHeader.jsx'

export function SynopsisReader({ synopsis, completedCount, onBack, onCopy }) {
  return (
    <>
      <div className="reader-shell mobile-action-shell">
        <div className="reader-card synopsis-reader-card">
          <PageHeader
            eyebrow="Synopsis Reader"
            title="เรื่องย่อรวม"
            description={`${completedCount} sections ready`}
            actions={
              <>
                <Button variant="secondary" onClick={onBack}>
                  กลับไปเขียน
                </Button>
                <Button variant="primary" onClick={onCopy}>
                  คัดลอก
                </Button>
              </>
            }
          />
          <pre className="reader-output">{synopsis || 'ยังไม่มีเนื้อหาสำหรับรวมเป็นเรื่องย่อ'}</pre>
        </div>
      </div>

      <div className="mobile-bottom-bar mobile-action-bar reader-bottom-bar">
        <div className="mobile-bottom-actions dual-mobile-actions">
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
