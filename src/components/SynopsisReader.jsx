import { Button } from './ui/Button.jsx'
import { PageHeader } from './ui/PageHeader.jsx'

export function SynopsisReader({ synopsis, completedCount, onBack, onCopy }) {
  return (
    <div className="reader-shell">
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
        <pre className="reader-output">
          {synopsis || 'ยังไม่มีเนื้อหาสำหรับรวมเป็นเรื่องย่อ'}
        </pre>
      </div>
    </div>
  )
}
