export function SynopsisReader({ synopsis, completedCount, onBack, onCopy }) {
  return (
    <div className="reader-shell">
      <div className="reader-card">
        <div className="reader-header">
          <div>
            <p className="eyebrow">Synopsis Reader</p>
            <h1>เรื่องย่อรวม</h1>
            <p className="reader-meta">{completedCount} sections ready</p>
          </div>
          <div className="reader-actions">
            <button className="secondary-button" type="button" onClick={onBack}>
              กลับไปเขียน
            </button>
            <button className="primary-button" type="button" onClick={onCopy}>
              คัดลอก
            </button>
          </div>
        </div>
        <pre className="reader-output">
          {synopsis || 'ยังไม่มีเนื้อหาสำหรับรวมเป็นเรื่องย่อ'}
        </pre>
      </div>
    </div>
  )
}
