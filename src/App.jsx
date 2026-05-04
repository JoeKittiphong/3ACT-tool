import { useEffect, useMemo, useState } from 'react'
import { MobileBottomBar } from './components/MobileBottomBar.jsx'
import { MobileOutlineDrawer } from './components/MobileOutlineDrawer.jsx'
import { OutlineContent } from './components/OutlineContent.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'
import { StoryLibrary } from './components/StoryLibrary.jsx'
import { SynopsisReader } from './components/SynopsisReader.jsx'
import { storyFramework } from './storyFramework'

const STORAGE_KEY = 'story-outline-3act-tool'

const createEmptyPoints = () => Object.fromEntries(storyFramework.map((point) => [point.id, '']))

const createProject = () => {
  const timestamp = new Date().toISOString()

  return {
    id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: '',
    genre: '',
    logline: '',
    theme: '',
    points: createEmptyPoints(),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

const hasProjectContent = (project) => {
  if (!project) return false

  const fields = [project.title, project.genre, project.logline, project.theme]
  const hasFieldContent = fields.some((value) => (value ?? '').trim().length > 0)
  const hasPointContent = Object.values(project.points ?? {}).some(
    (value) => (value ?? '').trim().length > 0,
  )

  return hasFieldContent || hasPointContent
}

const normalizeProject = (project) => ({
  ...createProject(),
  ...project,
  points: {
    ...createEmptyPoints(),
    ...(project.points ?? {}),
  },
  id: project.id ?? createProject().id,
  createdAt: project.createdAt ?? new Date().toISOString(),
  updatedAt: project.updatedAt ?? new Date().toISOString(),
})

const normalizeStore = (raw) => {
  if (raw && Array.isArray(raw.projects)) {
    const projects = raw.projects.map(normalizeProject)
    const currentProjectId =
      projects.find((project) => project.id === raw.currentProjectId)?.id ?? projects[0]?.id ?? null

    return { projects, currentProjectId }
  }

  if (raw && typeof raw === 'object') {
    const migratedProject = normalizeProject(raw)
    return {
      projects: [migratedProject],
      currentProjectId: migratedProject.id,
    }
  }

  return {
    projects: [],
    currentProjectId: null,
  }
}

function App() {
  const [projects, setProjects] = useState([])
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [selectedPointId, setSelectedPointId] = useState(storyFramework[0].id)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [isReaderOpen, setIsReaderOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const store = normalizeStore(parsed)

    if (store.projects.length === 0) {
      const firstProject = createProject()
      setProjects([firstProject])
      setCurrentProjectId(firstProject.id)
      setIsSettingsOpen(true)
      setIsHydrated(true)
      return
    }

    setProjects(store.projects)
    setCurrentProjectId(store.currentProjectId)
    setIsSettingsOpen(!hasProjectContent(store.projects.find((project) => project.id === store.currentProjectId)))
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        projects,
        currentProjectId,
      }),
    )
  }, [currentProjectId, isHydrated, projects])

  const currentProject = useMemo(
    () => projects.find((project) => project.id === currentProjectId) ?? null,
    [currentProjectId, projects],
  )

  const selectedPoint =
    storyFramework.find((point) => point.id === selectedPointId) ?? storyFramework[0]
  const selectedPointIndex = storyFramework.findIndex((point) => point.id === selectedPoint.id)
  const previousPoint = selectedPointIndex > 0 ? storyFramework[selectedPointIndex - 1] : null
  const nextPoint =
    selectedPointIndex < storyFramework.length - 1 ? storyFramework[selectedPointIndex + 1] : null

  const completedCount = useMemo(() => {
    if (!currentProject) return 0

    return storyFramework.filter((point) => {
      const content = currentProject.points[point.id] ?? ''
      return content.trim().length > 0
    }).length
  }, [currentProject])

  const synopsis = useMemo(() => {
    if (!currentProject) return ''

    const sections = storyFramework
      .map((point) => {
        const content = currentProject.points[point.id]?.trim()
        if (!content) return null
        return `${point.title}\n${content}`
      })
      .filter(Boolean)

    const projectHeader = [
      currentProject.title.trim() ? `ชื่อเรื่อง: ${currentProject.title.trim()}` : null,
      currentProject.genre.trim() ? `แนว: ${currentProject.genre.trim()}` : null,
      currentProject.theme.trim() ? `ธีม: ${currentProject.theme.trim()}` : null,
      currentProject.logline.trim() ? `Logline: ${currentProject.logline.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    return [projectHeader, ...sections].filter(Boolean).join('\n\n')
  }, [currentProject])

  const updateCurrentProject = (updater) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id !== currentProjectId) return project

        const nextProject = typeof updater === 'function' ? updater(project) : updater
        return {
          ...nextProject,
          updatedAt: new Date().toISOString(),
        }
      }),
    )
  }

  const updateProjectField = (field, value) => {
    updateCurrentProject((project) => ({
      ...project,
      [field]: value,
    }))
  }

  const updatePointContent = (pointId, value) => {
    updateCurrentProject((project) => ({
      ...project,
      points: {
        ...project.points,
        [pointId]: value,
      },
    }))
  }

  const createAndOpenNewStory = () => {
    const project = createProject()
    setProjects((currentProjects) => [project, ...currentProjects])
    setCurrentProjectId(project.id)
    setSelectedPointId(storyFramework[0].id)
    setIsLibraryOpen(false)
    setIsReaderOpen(false)
    setIsOutlineOpen(false)
    setIsSettingsOpen(true)
  }

  const openStory = (projectId) => {
    setCurrentProjectId(projectId)
    setSelectedPointId(storyFramework[0].id)
    setIsLibraryOpen(false)
    setIsReaderOpen(false)
    setIsOutlineOpen(false)
    const project = projects.find((item) => item.id === projectId)
    setIsSettingsOpen(project ? !hasProjectContent(project) : false)
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

  if (!isHydrated || !currentProject) {
    return null
  }

  if (isLibraryOpen) {
    return (
      <StoryLibrary
        projects={projects}
        currentProjectId={currentProjectId}
        onBack={() => setIsLibraryOpen(false)}
        onCreateNew={createAndOpenNewStory}
        onOpenProject={openStory}
      />
    )
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
        project={currentProject}
        onClose={() => setIsSettingsOpen(false)}
        onCreateNew={createAndOpenNewStory}
        onFieldChange={updateProjectField}
      />

      <MobileOutlineDrawer
        isOpen={isOutlineOpen}
        selectedPointId={selectedPointId}
        project={currentProject}
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
            <p className="hero-status">{currentProject.title.trim() || 'Untitled Story'}</p>
          </div>
          <div className="hero-actions">
            <button className="secondary-button" type="button" onClick={() => setIsSettingsOpen(true)}>
              ตั้งค่าเรื่อง
            </button>
            <button className="secondary-button" type="button" onClick={() => setIsLibraryOpen(true)}>
              เรื่องทั้งหมด
            </button>
            <button className="primary-button" type="button" onClick={() => setIsReaderOpen(true)}>
              อ่านเรื่องย่อ
            </button>
          </div>
        </header>

        <section className="workspace">
          <aside className="sidebar">
            <OutlineContent
              project={currentProject}
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
                value={currentProject.points[selectedPoint.id] ?? ''}
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
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
      />
    </>
  )
}

export default App
