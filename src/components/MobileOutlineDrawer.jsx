import { OutlineContent } from './OutlineContent.jsx'

export function MobileOutlineDrawer({
  isOpen,
  selectedPointId,
  project,
  completedCount,
  onClose,
  onSelectPoint,
}) {
  if (!isOpen) return null

  return (
    <div className="mobile-drawer-backdrop mobile-only" role="presentation" onClick={onClose}>
      <aside
        className="mobile-outline-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-outline-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Story Outline</p>
            <h2 id="story-outline-title">เลือก point</h2>
          </div>
          <button className="secondary-button modal-close" type="button" onClick={onClose}>
            ปิด
          </button>
        </div>
        <div className="outline-scroll">
          <OutlineContent
            project={project}
            selectedPointId={selectedPointId}
            completedCount={completedCount}
            onSelectPoint={onSelectPoint}
          />
        </div>
      </aside>
    </div>
  )
}
