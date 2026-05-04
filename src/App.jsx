import { useState } from 'react'
import { AuthScreen } from './components/AuthScreen.jsx'
import { EditorWorkspace } from './components/EditorWorkspace.jsx'
import { MobileOutlineDrawer } from './components/MobileOutlineDrawer.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'
import { StoryLibrary } from './components/StoryLibrary.jsx'
import { SynopsisReader } from './components/SynopsisReader.jsx'
import { ConfirmDialog } from './components/ui/ConfirmDialog.jsx'
import { useStoryProjects } from './hooks/useStoryProjects.js'
import { useSupabaseAuth } from './hooks/useSupabaseAuth.js'
import { storyFramework } from './storyFramework'

function App() {
  const {
    user,
    loading: authLoading,
    isConfigured,
    signInWithEmail,
    signOut,
  } = useSupabaseAuth()

  const {
    projects,
    currentProjectId,
    currentProject,
    completedCount,
    synopsis,
    isHydrated,
    shouldOpenSettings,
    setShouldOpenSettings,
    syncStatus,
    updateProjectField,
    updatePointContent,
    createAndOpenNewStory,
    deleteStory,
    openStory,
  } = useStoryProjects({
    user,
    syncEnabled: isConfigured,
  })

  const [selectedPointId, setSelectedPointId] = useState(storyFramework[0].id)
  const [isOutlineOpen, setIsOutlineOpen] = useState(false)
  const [isReaderOpen, setIsReaderOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState(null)
  const [authMessage, setAuthMessage] = useState('')
  const [authError, setAuthError] = useState('')

  const selectedPoint =
    storyFramework.find((point) => point.id === selectedPointId) ?? storyFramework[0]
  const selectedPointIndex = storyFramework.findIndex((point) => point.id === selectedPoint.id)
  const previousPoint = selectedPointIndex > 0 ? storyFramework[selectedPointIndex - 1] : null
  const nextPoint =
    selectedPointIndex < storyFramework.length - 1 ? storyFramework[selectedPointIndex + 1] : null

  const resetNavigation = () => {
    setSelectedPointId(storyFramework[0].id)
    setIsLibraryOpen(false)
    setIsReaderOpen(false)
    setIsOutlineOpen(false)
  }

  const openNewStory = () => {
    createAndOpenNewStory()
    resetNavigation()
    setPendingDeleteProjectId(null)
  }

  const openExistingStory = (projectId) => {
    openStory(projectId)
    resetNavigation()
    setPendingDeleteProjectId(null)
  }

  const requestDeleteStory = (projectId) => {
    setPendingDeleteProjectId(projectId)
  }

  const confirmDeleteStory = () => {
    if (!pendingDeleteProjectId) return

    deleteStory(pendingDeleteProjectId)
    setPendingDeleteProjectId(null)
  }

  const closeLibrary = () => {
    setIsLibraryOpen(false)
    setPendingDeleteProjectId(null)
  }

  const handleEmailSignIn = async (email, password) => {
    setAuthError('')
    setAuthMessage('')

    try {
      const { error } = await signInWithEmail(email, password)
      if (error) throw error
    } catch (error) {
      console.error('Auth failed', error)
      setAuthError(error.message || 'เข้าสู่ระบบไม่สำเร็จ')
    }
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

  if (authLoading) {
    return null
  }

  if (isConfigured && !user) {
    return (
      <AuthScreen
        onSubmit={handleEmailSignIn}
        loading={authLoading}
        errorMessage={authError}
        infoMessage={authMessage}
      />
    )
  }

  if (!isHydrated || !currentProject) {
    return null
  }

  if (isLibraryOpen) {
    return (
      <>
        <StoryLibrary
          projects={projects}
          currentProjectId={currentProjectId}
          onBack={closeLibrary}
          onCreateNew={openNewStory}
          onOpenProject={openExistingStory}
          onDeleteProject={requestDeleteStory}
        />
        <ConfirmDialog
          isOpen={Boolean(pendingDeleteProjectId)}
          title="ลบเรื่องนี้?"
          description="ถ้าลบแล้วจะหายจากรายการเรื่องทั้งหมด และถ้าเปิด sync ไว้จะลบจาก cloud ด้วย"
          confirmLabel="ลบเรื่อง"
          cancelLabel="ยกเลิก"
          onConfirm={confirmDeleteStory}
          onCancel={() => setPendingDeleteProjectId(null)}
        />
      </>
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
        syncStatus={syncStatus}
        isCloudMode={isConfigured}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointContentChange={updatePointContent}
        onSelectPoint={setSelectedPointId}
        onOpenSettings={() => setShouldOpenSettings(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenOutline={() => setIsOutlineOpen(true)}
        onSignOut={signOut}
      />
    </>
  )
}

export default App
