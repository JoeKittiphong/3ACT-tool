import { storyFramework } from '../storyFramework'

function getCompletedCount(project) {
  return storyFramework.filter((point) => {
    const content = project.points?.[point.id] ?? ''
    return content.trim().length > 0
  }).length
}

export function StoryLibrary({ projects, currentProjectId, onBack, onCreateNew, onOpenProject }) {
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
          {projects.map((project) => {
            const completedCount = getCompletedCount(project)
            const isCurrent = project.id === currentProjectId

            return (
              <button
                key={project.id}
                type="button"
                className={`library-item ${isCurrent ? 'active' : ''}`}
                onClick={() => onOpenProject(project.id)}
              >
                <div className="library-item-top">
                  <span className="chip">{project.title.trim() || 'Untitled Story'}</span>
                  <span className="progress-pill">
                    {completedCount}/{storyFramework.length}
                  </span>
                </div>
                <strong>{project.genre.trim() || 'No genre yet'}</strong>
                <p>{project.logline.trim() || 'Tap to continue writing this synopsis.'}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
