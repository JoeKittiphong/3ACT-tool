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
  syncStatus,
  isCloudMode,
  onTouchStart,
  onTouchEnd,
  onPointContentChange,
  onSelectPoint,
  onOpenSettings,
  onOpenStoryline,
  onOpenLibrary,
  onOpenReader,
  onOpenOutline,
  onSignOut,
}) {
  const syncLabelMap = {
    local: 'Local only',
    syncing: 'Syncing...',
    synced: 'Synced',
    error: 'Sync error',
  }

  const syncToneMap = {
    local: 'blue',
    syncing: 'yellow',
    synced: 'green',
    error: 'pink',
  }

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
                <Badge tone={syncToneMap[syncStatus] ?? 'blue'}>
                  {isCloudMode ? syncLabelMap[syncStatus] ?? 'Syncing...' : 'Local mode'}
                </Badge>
                <Button variant="secondary" onClick={onOpenSettings}>
                  ตั้งค่าเรื่อง
                </Button>
                <Button variant="secondary" onClick={onOpenStoryline}>
                  Storyline
                </Button>
                <Button variant="secondary" onClick={onOpenLibrary}>
                  เรื่องทั้งหมด
                </Button>
                <Button variant="primary" onClick={onOpenReader}>
                  อ่านเรื่องย่อ
                </Button>
                {isCloudMode ? (
                  <Button variant="secondary" onClick={onSignOut}>
                    Sign out
                  </Button>
                ) : null}
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
                <Badge>{project.title.trim() || 'Untitled Story'}</Badge>
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
              <div className="editor-footer">
                <span className="char-count">
                  ความยาว: {(project.points[selectedPoint.id] ?? '').length} ตัวอักษร
                  <span className="char-recommend"> (แนะนำประมาณ 150-300 ตัวอักษร)</span>
                </span>
              </div>
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
        syncStatus={syncStatus}
        isCloudMode={isCloudMode}
        onOpenOutline={onOpenOutline}
        onOpenStoryline={onOpenStoryline}
        onOpenSettings={onOpenSettings}
        onOpenLibrary={onOpenLibrary}
        onOpenReader={onOpenReader}
        onSignOut={onSignOut}
      />
    </>
  )
}
