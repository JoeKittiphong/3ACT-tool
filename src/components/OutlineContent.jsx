import { groupBySequence, storyFramework } from '../storyFramework'

export function OutlineContent({ project, selectedPointId, completedCount, onSelectPoint }) {
  return (
    <>
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
                  onClick={() => onSelectPoint(point.id)}
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
    </>
  )
}
