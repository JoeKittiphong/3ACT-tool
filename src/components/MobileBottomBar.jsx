import { Button } from './ui/Button.jsx'

export function MobileBottomBar({
  selectedPoint,
  completedCount,
  totalPoints,
  onOpenOutline,
  onOpenSettings,
  onOpenLibrary,
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
        <Button variant="secondary" className="mobile-bottom-button" onClick={onOpenOutline}>
          Points
        </Button>
        <Button variant="secondary" className="mobile-bottom-button" onClick={onOpenSettings}>
          ตั้งค่า
        </Button>
        <Button variant="secondary" className="mobile-bottom-button" onClick={onOpenLibrary}>
          เรื่อง
        </Button>
        <Button variant="primary" className="mobile-bottom-button" onClick={onOpenReader}>
          อ่าน
        </Button>
      </div>
    </div>
  )
}
