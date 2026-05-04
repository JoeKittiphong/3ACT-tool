import { getCompletedCount } from '../lib/storyStore'
import { storyFramework } from '../storyFramework'

export function StoryLibrary({
  projects,
  currentProjectId,
  onBack,
  onCreateNew,
  onOpenProject,
  onDeleteProject,
}) {
  const sortedProjects = [...projects].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime()
    return bTime - aTime
  })

  return (
    <div className="reader-shell">
      <div className="reader-card library-card">
        <div className="reader-header">
          <div>
            <p className="eyebrow">Story Library</p>
            <h1>เรื่องทั้งหมด</h1>
            <p className="reader-meta">{projects.length} projects saved</p>
          </div>
          <div className="reader-actions">
            <button className="secondary-button" type="button" onClick={onBack}>
              กลับไปเขียน
            </button>
            <button className="primary-button" type="button" onClick={onCreateNew}>
              เพิ่มเรื่องใหม่
            </button>
          </div>
        </div>

        <div className="library-grid">
          {sortedProjects.map((project) => {
            const completedCount = getCompletedCount(project)
            const isCurrent = project.id === currentProjectId

            return (
              <article
                key={project.id}
                className={`library-item ${isCurrent ? 'active' : ''}`}
                onClick={() => onOpenProject(project.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onOpenProject(project.id)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <button
                  className="secondary-button danger-button library-delete-button"
                  type="button"
                  aria-label="Delete story"
                  title="Delete story"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDeleteProject(project.id)
                  }}
                >
                  ✕
                </button>
                <div className="library-item-top">
                  <span className="chip">{project.title.trim() || 'Untitled Story'}</span>
                  <span className="progress-pill">
                    {completedCount}/{storyFramework.length}
                  </span>
                </div>
                <strong>{project.genre.trim() || 'No genre yet'}</strong>
                <p>{project.logline.trim() || 'Tap to continue writing this synopsis.'}</p>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
