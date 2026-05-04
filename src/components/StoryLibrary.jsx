import { getCompletedCount } from '../lib/storyStore'
import { storyFramework } from '../storyFramework'
import { Badge } from './ui/Badge.jsx'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { IconButton } from './ui/IconButton.jsx'
import { PageHeader } from './ui/PageHeader.jsx'

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
      <Card className="reader-card library-card">
        <PageHeader
          eyebrow="Story Library"
          title="เรื่องทั้งหมด"
          description={`${projects.length} projects saved`}
          actions={
            <>
              <Button variant="secondary" onClick={onBack}>
                กลับไปเขียน
              </Button>
              <Button variant="primary" onClick={onCreateNew}>
                เพิ่มเรื่องใหม่
              </Button>
            </>
          }
        />

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
                <IconButton
                  className="danger-button library-delete-button"
                  label="Delete story"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDeleteProject(project.id)
                  }}
                >
                  ✕
                </IconButton>
                <div className="library-item-top">
                  <Badge tone="blue">{project.title.trim() || 'Untitled Story'}</Badge>
                  <Badge tone="yellow">
                    {completedCount}/{storyFramework.length}
                  </Badge>
                </div>
                <strong>{project.genre.trim() || 'No genre yet'}</strong>
                <p>{project.logline.trim() || 'Tap to continue writing this synopsis.'}</p>
              </article>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
