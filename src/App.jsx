import { useEffect, useMemo, useState } from 'react'
import { groupBySequence, storyFramework } from './storyFramework'

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
  const [isHydrated, setIsHydrated] = useState(false)

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

  if (!isHydrated) {
    return null
  }

  return (
    <>
      {isSettingsOpen && (
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
              <button
                className="secondary-button modal-close"
                type="button"
                onClick={() => setIsSettingsOpen(false)}
              >
                ปิด
              </button>
            </div>

            <div className="field-grid">
              <label>
                <span>ชื่อเรื่อง</span>
                <input
                  value={project.title}
                  onChange={(event) => updateProjectField('title', event.target.value)}
                  placeholder="ชื่อโปรเจกต์หรือชื่อเรื่อง"
                />
              </label>
              <label>
                <span>แนวเรื่อง</span>
                <input
                  value={project.genre}
                  onChange={(event) => updateProjectField('genre', event.target.value)}
                  placeholder="แฟนตาซี, โรแมนติก, สืบสวน..."
                />
              </label>
              <label className="wide">
                <span>ธีมหลัก</span>
                <input
                  value={project.theme}
                  onChange={(event) => updateProjectField('theme', event.target.value)}
                  placeholder="เรื่องนี้อยากพูดถึงอะไร"
                />
              </label>
              <label className="wide">
                <span>Logline</span>
                <textarea
                  value={project.logline}
                  onChange={(event) => updateProjectField('logline', event.target.value)}
                  placeholder="สรุปเรื่อง 1-2 ประโยค"
                  rows={4}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={createNewStory}>
                เริ่มเรื่องใหม่
              </button>
              <button className="primary-button" type="button" onClick={() => setIsSettingsOpen(false)}>
                บันทึกและเริ่มเขียน
              </button>
            </div>
          </section>
        </div>
      )}

      <div className="app-shell">
        <header className="hero">
          <div className="hero-brand">
            <h1>Story Synopsis Builder</h1>
            <p className="hero-status">
              {project.title.trim() || 'Untitled Story'}
            </p>
          </div>
          <div className="hero-actions">
            <button className="secondary-button" type="button" onClick={() => setIsSettingsOpen(true)}>
              ตั้งค่าเรื่อง
            </button>
            <button className="secondary-button" type="button" onClick={createNewStory}>
              สร้างเรื่องใหม่
            </button>
            <button className="primary-button" type="button" onClick={copySynopsis}>
              คัดลอกเรื่องย่อ
            </button>
          </div>
        </header>

        <section className="workspace">
          <aside className="sidebar">
            <div className="sidebar-header">
              <div>
                <p className="sidebar-label">Progress</p>
                <strong>
                  {completedCount}/{storyFramework.length} points
                </strong>
              </div>
              <div className="progress-pill">
                {Math.round((completedCount / storyFramework.length) * 100)}%
              </div>
            </div>

            {Object.entries(groupBySequence).map(([groupTitle, points]) => (
              <section key={groupTitle} className="sequence-group">
                <h2>{groupTitle}</h2>
                <div className="point-list">
                  {points.map((point) => {
                    const isActive = point.id === selectedPointId
                    const hasContent = (project.points[point.id] ?? '').trim().length > 0
                    return (
                      <button
                        key={point.id}
                        type="button"
                        className={`point-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedPointId(point.id)}
                      >
                        <span className="point-index">{point.id.toUpperCase()}</span>
                        <span className="point-text">
                          <strong>{point.title}</strong>
                          <small>{hasContent ? 'เขียนแล้ว' : 'ยังไม่เขียน'}</small>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </aside>

          <main className="editor-panel">
            <div className="panel-card">
              <div className="mobile-progress">
                <div>
                  <p className="panel-kicker">Writing Progress</p>
                  <strong>
                    {completedCount}/{storyFramework.length} points completed
                  </strong>
                </div>
                <div className="progress-pill">
                  {Math.round((completedCount / storyFramework.length) * 100)}%
                </div>
              </div>

              <div className="mobile-nav">
                <button
                  className="secondary-button nav-button"
                  type="button"
                  onClick={() => previousPoint && setSelectedPointId(previousPoint.id)}
                  disabled={!previousPoint}
                >
                  Previous
                </button>
                <label className="point-picker">
                  <span>Point</span>
                  <select
                    value={selectedPoint.id}
                    onChange={(event) => setSelectedPointId(event.target.value)}
                  >
                    {storyFramework.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.id.toUpperCase()} - {point.title}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="secondary-button nav-button"
                  type="button"
                  onClick={() => nextPoint && setSelectedPointId(nextPoint.id)}
                  disabled={!nextPoint}
                >
                  Next
                </button>
              </div>

              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">
                    Act {selectedPoint.act} / Sequence {selectedPoint.sequence}
                  </p>
                  <h2>{selectedPoint.title}</h2>
                </div>
                <span className="chip">{selectedPoint.id.toUpperCase()}</span>
              </div>
              <p className="prompt">{selectedPoint.prompt}</p>
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
                <button className="secondary-button preview-copy" type="button" onClick={copySynopsis}>
                  Copy
                </button>
              </div>
              <pre className="synopsis-output">
                {synopsis || 'เมื่อเริ่มกรอกข้อมูลในแต่ละ point ระบบจะรวมเป็นเรื่องย่อให้ตรงนี้'}
              </pre>
            </div>
          </aside>
        </section>
      </div>
    </>
  )
}

export default App
