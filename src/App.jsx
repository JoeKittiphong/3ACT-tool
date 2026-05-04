import { useState } from 'react'
import { EditorWorkspace } from './components/EditorWorkspace.jsx'
import { MobileOutlineDrawer } from './components/MobileOutlineDrawer.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'
import { StoryLibrary } from './components/StoryLibrary.jsx'
import { SynopsisReader } from './components/SynopsisReader.jsx'
import { useStoryProjects } from './hooks/useStoryProjects.js'
import { storyFramework } from './storyFramework'

function App() {
  const {
    projects,
    currentProjectId,
    currentProject,
    completedCount,
    synopsis,
    isHydrated,
    shouldOpenSettings,
    setShouldOpenSettings,
    updateProjectField,
    updatePointContent,
    createAndOpenNewStory,
    deleteStory,
    openStory,
  } = useStoryProjects()

  const [selectedPointId, setSelectedPointId] = useState(storyFramework[0].id)
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [isReaderOpen, setIsReaderOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  const selectedPoint =
    storyFramework.find((point) => point.id === selectedPointId) ?? storyFramework[0]
  const selectedPointIndex = storyFramework.findIndex((point) => point.id === selectedPoint.id)
  const previousPoint = selectedPointIndex > 0 ? storyFramework[selectedPointIndex - 1] : null
  const nextPoint =
    selectedPointIndex < storyFramework.length - 1 ? storyFramework[selectedPointIndex + 1] : null

  const openNewStory = () => {
    createAndOpenNewStory()
    setSelectedPointId(storyFramework[0].id)
    setIsLibraryOpen(false)
    setIsReaderOpen(false)
    setIsOutlineOpen(false)
  }

  const openExistingStory = (projectId) => {
    openStory(projectId)
    setSelectedPointId(storyFramework[0].id)
    setIsLibraryOpen(false)
    setIsReaderOpen(false)
    setIsOutlineOpen(false)
  }

  const deleteExistingStory = (projectId) => {
    deleteStory(projectId)
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

  if (!isHydrated || !currentProject) {
    return null
  }

  if (isLibraryOpen) {
    return (
      <StoryLibrary
        projects={projects}
        currentProjectId={currentProjectId}
        onBack={() => setIsLibraryOpen(false)}
        onCreateNew={openNewStory}
        onOpenProject={openExistingStory}
        onDeleteProject={deleteExistingStory}
      />
    )
  }

  if (isReaderOpen) {
    return (
      <SynopsisReader
        synopsis={synopsis}
        completedCount={completedCount}
        onBack={() => setIsReaderOpen(false)}
        onCopy={copySynopsis}
      />
    )
  }

  return (
    <>
      <SettingsModal
        isOpen={shouldOpenSettings}
        project={currentProject}
        onClose={() => setShouldOpenSettings(false)}
        onCreateNew={openNewStory}
        onFieldChange={updateProjectField}
      />

      <MobileOutlineDrawer
        isOpen={isOutlineOpen}
        selectedPointId={selectedPointId}
        project={currentProject}
        completedCount={completedCount}
        onClose={() => setIsOutlineOpen(false)}
        onSelectPoint={(pointId) => {
          setSelectedPointId(pointId)
          setIsOutlineOpen(false)
        }}
      />

      <EditorWorkspace
        project={currentProject}
        selectedPoint={selectedPoint}
        completedCount={completedCount}
        totalPoints={storyFramework.length}
        synopsis={synopsis}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointContentChange={updatePointContent}
        onSelectPoint={setSelectedPointId}
        onOpenSettings={() => setShouldOpenSettings(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenOutline={() => setIsOutlineOpen(true)}
      />
    </>
  )
}

export default App
