import { MobileBottomBar } from './MobileBottomBar.jsx'
import { OutlineContent } from './OutlineContent.jsx'

export function EditorWorkspace({
  project,
  selectedPoint,
  completedCount,
  totalPoints,
  synopsis,
  onTouchStart,
  onTouchEnd,
  onPointContentChange,
  onSelectPoint,
  onOpenSettings,
  onOpenLibrary,
  onOpenReader,
  onOpenOutline,
}) {
  return (
    <>
      <div className="app-shell">
        <header className="hero">
          <div className="hero-brand">
            <p className="eyebrow">3 Act Story Lab</p>
            <h1>Story Synopsis Builder</h1>
            <p className="hero-status">{project.title.trim() || 'Untitled Story'}</p>
          </div>
          <div className="hero-actions">
            <button className="secondary-button" type="button" onClick={onOpenSettings}>
              ตั้งค่าเรื่อง
            </button>
            <button className="secondary-button" type="button" onClick={onOpenLibrary}>
              เรื่องทั้งหมด
            </button>
            <button className="primary-button" type="button" onClick={onOpenReader}>
              อ่านเรื่องย่อ
            </button>
          </div>
        </header>

        <section className="workspace">
          <aside className="sidebar">
            <OutlineContent
              project={project}
              selectedPointId={selectedPoint.id}
              completedCount={completedCount}
              onSelectPoint={onSelectPoint}
            />
          </aside>

          <main className="editor-panel">
            <div className="panel-card editor-card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="editor-strip">
                <span className="editor-badge">Writing Room</span>
                <span className="editor-badge light">
                  {completedCount}/{totalPoints} completed
                </span>
              </div>
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">
                    Act {selectedPoint.act} / Sequence {selectedPoint.sequence}
                  </p>
                  <h2>{selectedPoint.title}</h2>
                </div>
              </div>
              <div className="prompt-row">
                <span className="chip">{selectedPoint.id.toUpperCase()}</span>
                <p className="prompt">{selectedPoint.prompt}</p>
              </div>
              <textarea
                className="point-editor"
                value={project.points[selectedPoint.id] ?? ''}
                onChange={(event) => onPointContentChange(selectedPoint.id, event.target.value)}
                placeholder="เขียนรายละเอียดของ point นี้ที่นี่"
                rows={16}
              />
            </div>
          </main>

          <aside className="preview-panel">
            <div className="panel-card preview-card">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Synopsis Preview</p>
                  <h2>เรื่องย่อรวม</h2>
                </div>
              </div>
              <div className="preview-meta">
                <span>{completedCount} sections ready</span>
                <button className="secondary-button preview-copy" type="button" onClick={onOpenReader}>
                  อ่าน
                </button>
              </div>
              <pre className="synopsis-output">
                {synopsis || 'เมื่อเริ่มกรอกข้อมูลในแต่ละ point ระบบจะรวมเป็นเรื่องย่อให้ตรงนี้'}
              </pre>
            </div>
          </aside>
        </section>
      </div>

      <MobileBottomBar
        selectedPoint={selectedPoint}
        completedCount={completedCount}
        totalPoints={totalPoints}
        onOpenOutline={onOpenOutline}
        onOpenSettings={onOpenSettings}
        onOpenLibrary={onOpenLibrary}
        onOpenReader={onOpenReader}
      />
    </>
  )
}
