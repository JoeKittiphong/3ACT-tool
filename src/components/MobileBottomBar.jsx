export function MobileBottomBar({
  selectedPoint,
  completedCount,
  totalPoints,
  onOpenOutline,
  onOpenSettings,
  onCreateNew,
  onOpenReader,
}) {
  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bottom-status">
        <strong>{selectedPoint.id.toUpperCase()}</strong>
        <span>
          {completedCount}/{totalPoints}
        </span>
      </div>
      <div className="mobile-bottom-actions">
        <button className="secondary-button mobile-bottom-button" type="button" onClick={onOpenOutline}>
          Points
        </button>
        <button className="secondary-button mobile-bottom-button" type="button" onClick={onOpenSettings}>
          ตั้งค่า
        </button>
        <button className="secondary-button mobile-bottom-button" type="button" onClick={onCreateNew}>
          ใหม่
        </button>
        <button className="primary-button mobile-bottom-button" type="button" onClick={onOpenReader}>
          อ่าน
        </button>
      </div>
    </div>
  )
}
