import { useEffect, useMemo, useState } from 'react'
import { MobileBottomBar } from './components/MobileBottomBar.jsx'
import { MobileOutlineDrawer } from './components/MobileOutlineDrawer.jsx'
import { OutlineContent } from './components/OutlineContent.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'
import { SynopsisReader } from './components/SynopsisReader.jsx'
import { storyFramework } from './storyFramework'

const STORAGE_KEY = 'story-outline-3act-tool'

const createInitialProject = () => ({
  title: '',
  genre: '',
  logline: '',
  theme: '',
  points: Object.fromEntries(storyFramework.map((point) => [point.id, ''])),
})

const hasProjectContent = (project) => {
  if (!project) return false

  const fields = [project.title, project.genre, project.logline, project.theme]
  const hasFieldContent = fields.some((value) => (value ?? '').trim().length > 0)
  const hasPointContent = Object.values(project.points ?? {}).some(
    (value) => (value ?? '').trim().length > 0,
  )

  return hasFieldContent || hasPointContent
}

function App() {
  const [project, setProject] = useState(createInitialProject)
  const [selectedPointId, setSelectedPointId] = useState(storyFramework[0].id)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [isReaderOpen, setIsReaderOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      setIsSettingsOpen(true)
      setIsHydrated(true)
      return
    }

    try {
      const saved = {
        ...createInitialProject(),
        ...JSON.parse(raw),
      }

      const normalizedProject = {
        ...saved,
        points: {
          ...createInitialProject().points,
          ...(saved.points ?? {}),
        },
      }

      setProject(normalizedProject)
      setIsSettingsOpen(!hasProjectContent(normalizedProject))
    } catch (error) {
      console.error('Failed to parse saved project', error)
      setIsSettingsOpen(true)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
  }, [isHydrated, project])

  const selectedPoint =
    storyFramework.find((point) => point.id === selectedPointId) ?? storyFramework[0]
  const selectedPointIndex = storyFramework.findIndex((point) => point.id === selectedPoint.id)
  const previousPoint = selectedPointIndex > 0 ? storyFramework[selectedPointIndex - 1] : null
  const nextPoint =
    selectedPointIndex < storyFramework.length - 1 ? storyFramework[selectedPointIndex + 1] : null

  const completedCount = useMemo(
    () =>
      storyFramework.filter((point) => {
        const content = project.points[point.id] ?? ''
        return content.trim().length > 0
      }).length,
    [project.points],
  )

  const synopsis = useMemo(() => {
    const sections = storyFramework
      .map((point) => {
        const content = project.points[point.id]?.trim()
        if (!content) return null
        return `${point.title}\n${content}`
      })
      .filter(Boolean)

    const projectHeader = [
      project.title.trim() ? `ชื่อเรื่อง: ${project.title.trim()}` : null,
      project.genre.trim() ? `แนว: ${project.genre.trim()}` : null,
      project.theme.trim() ? `ธีม: ${project.theme.trim()}` : null,
      project.logline.trim() ? `Logline: ${project.logline.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    return [projectHeader, ...sections].filter(Boolean).join('\n\n')
  }, [project])

  const updateProjectField = (field, value) => {
    setProject((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updatePointContent = (pointId, value) => {
    setProject((current) => ({
      ...current,
      points: {
        ...current.points,
        [pointId]: value,
      },
    }))
  }

  const createNewStory = () => {
    setProject(createInitialProject())
    setSelectedPointId(storyFramework[0].id)
    setIsSettingsOpen(true)
  }

  const copySynopsis = async () => {
    if (!synopsis.trim()) return

    try {
      await window.navigator.clipboard.writeText(synopsis)
      window.alert('คัดลอกเรื่องย่อแล้ว')
    } catch (error) {
      console.error('Failed to copy synopsis', error)
      window.alert('คัดลอกไม่สำเร็จ')
    }
  }

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    })
  }

  const handleTouchEnd = (event) => {
    if (!touchStart) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    setTouchStart(null)

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return
    }

    if (deltaX < 0 && nextPoint) {
      setSelectedPointId(nextPoint.id)
    }

    if (deltaX > 0 && previousPoint) {
      setSelectedPointId(previousPoint.id)
    }
  }

  if (!isHydrated) {
    return null
  }

  if (isReaderOpen) {
    return (
      <SynopsisReader
        synopsis={synopsis}
        completedCount={completedCount}
        onBack={() => setIsReaderOpen(false)}
        onCopy={copySynopsis}
      />
    )
  }

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        project={project}
        onClose={() => setIsSettingsOpen(false)}
        onCreateNew={createNewStory}
        onFieldChange={updateProjectField}
      />

      <MobileOutlineDrawer
        isOpen={isOutlineOpen}
        selectedPointId={selectedPointId}
        project={project}
        completedCount={completedCount}
        onClose={() => setIsOutlineOpen(false)}
        onSelectPoint={(pointId) => {
          setSelectedPointId(pointId)
          setIsOutlineOpen(false)
        }}
      />

      <div className="app-shell">
        <header className="hero">
          <div className="hero-brand">
            <p className="eyebrow">3 Act Story Lab</p>
            <h1>Story Synopsis Builder</h1>
            <p className="hero-status">{project.title.trim() || 'Untitled Story'}</p>
          </div>
          <div className="hero-actions">
            <button className="secondary-button" type="button" onClick={() => setIsSettingsOpen(true)}>
              ตั้งค่าเรื่อง
            </button>
            <button className="secondary-button" type="button" onClick={createNewStory}>
              สร้างเรื่องใหม่
            </button>
            <button className="primary-button" type="button" onClick={() => setIsReaderOpen(true)}>
              อ่านเรื่องย่อ
            </button>
          </div>
        </header>

        <section className="workspace">
          <aside className="sidebar">
            <OutlineContent
              project={project}
              selectedPointId={selectedPointId}
              completedCount={completedCount}
              onSelectPoint={setSelectedPointId}
            />
          </aside>

          <main className="editor-panel">
            <div className="panel-card editor-card" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <div className="editor-strip">
                <span className="editor-badge">Writing Room</span>
                <span className="editor-badge light">
                  {completedCount}/{storyFramework.length} completed
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
                onChange={(event) => updatePointContent(selectedPoint.id, event.target.value)}
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
                <button className="secondary-button preview-copy" type="button" onClick={() => setIsReaderOpen(true)}>
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
        totalPoints={storyFramework.length}
        onOpenOutline={() => setIsOutlineOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onCreateNew={createNewStory}
        onOpenReader={() => setIsReaderOpen(true)}
      />
    </>
  )
}

export default App
