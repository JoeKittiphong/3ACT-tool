import { useMemo, useState } from 'react'

export function useWorkspaceViewState(framework) {
  const [selectedPointId, setSelectedPointId] = useState(framework[0].id)
  const [activeView, setActiveView] = useState('editor')
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState(null)

  const selectedPoint = useMemo(
    () => framework.find((point) => point.id === selectedPointId) ?? framework[0],
    [framework, selectedPointId],
  )

  const selectedPointIndex = framework.findIndex((point) => point.id === selectedPoint.id)
  const previousPoint = selectedPointIndex > 0 ? framework[selectedPointIndex - 1] : null
  const nextPoint = selectedPointIndex < framework.length - 1 ? framework[selectedPointIndex + 1] : null

  const resetWorkspaceView = () => {
    setSelectedPointId(framework[0].id)
    setActiveView('editor')
    setIsOutlineOpen(false)
  }

  const openLibrary = () => setActiveView('library')
  const closeLibrary = () => {
    setActiveView('editor')
    setPendingDeleteProjectId(null)
  }

  const openReader = () => setActiveView('reader')
  const closeReader = () => setActiveView('editor')
  const openStoryline = () => setActiveView('storyline')
  const closeStoryline = () => setActiveView('editor')
  const openOutline = () => setIsOutlineOpen(true)
  const closeOutline = () => setIsOutlineOpen(false)

  const selectPoint = (pointId) => {
    setSelectedPointId(pointId)
  }

  const requestDeleteStory = (projectId) => setPendingDeleteProjectId(projectId)
  const clearPendingDeleteStory = () => setPendingDeleteProjectId(null)

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

  return {
    activeView,
    isOutlineOpen,
    selectedPointId,
    selectedPoint,
    pendingDeleteProjectId,
    setSelectedPointId,
    selectPoint,
    resetWorkspaceView,
    openLibrary,
    closeLibrary,
    openReader,
    closeReader,
    openStoryline,
    closeStoryline,
    openOutline,
    closeOutline,
    requestDeleteStory,
    clearPendingDeleteStory,
    handleTouchStart,
    handleTouchEnd,
  }
}
