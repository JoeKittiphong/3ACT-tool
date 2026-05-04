import { Button } from './ui/Button.jsx'

export function MobileBottomBar({
  selectedPoint,
  completedCount,
  totalPoints,
  syncStatus,
  isCloudMode,
  onOpenOutline,
  onOpenSettings,
  onOpenLibrary,
  onOpenReader,
  onSignOut,
}) {
  const syncLabelMap = {
    local: 'Local',
    syncing: 'Syncing',
    synced: 'Synced',
    error: 'Error',
  }

  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-cloud-tools">
        <span className={`mobile-sync-pill ${syncStatus ?? 'local'}`}>
          {isCloudMode ? syncLabelMap[syncStatus] ?? 'Syncing' : 'Local mode'}
        </span>
        {isCloudMode ? (
          <Button variant="secondary" className="mobile-bottom-button mobile-signout-button" onClick={onSignOut}>
            Sign out
          </Button>
        ) : null}
      </div>
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
