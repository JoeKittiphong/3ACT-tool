import { MobileBottomBar } from './MobileBottomBar.jsx'
import { OutlineContent } from './OutlineContent.jsx'
import { Badge } from './ui/Badge.jsx'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { PageHeader } from './ui/PageHeader.jsx'

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
          <PageHeader
            eyebrow="3 Act Story Lab"
            title="Story Synopsis Builder"
            description={project.title.trim() || 'Untitled Story'}
            actions={
              <>
                <Button variant="secondary" onClick={onOpenSettings}>
                  ตั้งค่าเรื่อง
                </Button>
                <Button variant="secondary" onClick={onOpenLibrary}>
                  เรื่องทั้งหมด
                </Button>
                <Button variant="primary" onClick={onOpenReader}>
                  อ่านเรื่องย่อ
                </Button>
              </>
            }
          />
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
            <Card className="panel-card editor-card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="editor-strip">
                <Badge>Writing Room</Badge>
                <Badge tone="green">
                  {completedCount}/{totalPoints} completed
                </Badge>
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
                <Badge tone="blue">{selectedPoint.id.toUpperCase()}</Badge>
                <p className="prompt">{selectedPoint.prompt}</p>
              </div>
              <textarea
                className="point-editor"
                value={project.points[selectedPoint.id] ?? ''}
                onChange={(event) => onPointContentChange(selectedPoint.id, event.target.value)}
                placeholder="เขียนรายละเอียดของ point นี้ที่นี่"
                rows={16}
              />
            </Card>
          </main>

          <aside className="preview-panel">
            <Card className="panel-card preview-card">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Synopsis Preview</p>
                  <h2>เรื่องย่อรวม</h2>
                </div>
              </div>
              <div className="preview-meta">
                <span>{completedCount} sections ready</span>
                <Button variant="secondary" className="preview-copy" onClick={onOpenReader}>
                  อ่าน
                </Button>
              </div>
              <pre className="synopsis-output">
                {synopsis || 'เมื่อเริ่มกรอกข้อมูลในแต่ละ point ระบบจะรวมเป็นเรื่องย่อให้ตรงนี้'}
              </pre>
            </Card>
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
