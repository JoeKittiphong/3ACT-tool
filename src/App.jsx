import { useMemo, useState } from 'react'
import { AuthScreen } from './components/AuthScreen.jsx'
import { EditorWorkspace } from './components/EditorWorkspace.jsx'
import { MobileOutlineDrawer } from './components/MobileOutlineDrawer.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'
import { StoryLibrary } from './components/StoryLibrary.jsx'
import { StorylineWorkspace } from './components/StorylineWorkspace.jsx'
import { SynopsisReader } from './components/SynopsisReader.jsx'
import { ConfirmDialog } from './components/ui/ConfirmDialog.jsx'
import { useAuthFlow } from './hooks/useAuthFlow.js'
import { useStoryProjects } from './hooks/useStoryProjects.js'
import { useSupabaseAuth } from './hooks/useSupabaseAuth.js'
import { useWorkspaceViewState } from './hooks/useWorkspaceViewState.js'
import { buildSynopsis } from './lib/storyStore'
import { storyFramework } from './storyFramework'

function App() {
  const [showPointTitlesInReader, setShowPointTitlesInReader] = useState(true)

  const {
    user,
    loading: authLoading,
    isConfigured,
    signInWithEmail,
    signOut,
    resetPassword,
  } = useSupabaseAuth()

  const { authMessage, authError, handleEmailSignIn, handleResetPassword } = useAuthFlow({
    signInWithEmail,
    resetPassword,
  })

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

  const {
    activeView,
    isOutlineOpen,
    selectedPointId,
    selectedPoint,
    pendingDeleteProjectId,
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
  } = useWorkspaceViewState(storyFramework)

  const readerSynopsis = useMemo(
    () => buildSynopsis(currentProject, { includePointTitles: showPointTitlesInReader }),
    [currentProject, showPointTitlesInReader],
  )

  const openNewStory = () => {
    createAndOpenNewStory()
    resetWorkspaceView()
    clearPendingDeleteStory()
  }

  const openExistingStory = (projectId) => {
    openStory(projectId)
    resetWorkspaceView()
    clearPendingDeleteStory()
  }

  const confirmDeleteStory = () => {
    if (!pendingDeleteProjectId) return
    deleteStory(pendingDeleteProjectId)
    clearPendingDeleteStory()
  }

  const copySynopsis = async () => {
    if (!readerSynopsis.trim()) return

    try {
      await window.navigator.clipboard.writeText(readerSynopsis)
      window.alert('คัดลอกเรื่องย่อแล้ว')
    } catch (error) {
      console.error('Failed to copy synopsis', error)
      window.alert('คัดลอกไม่สำเร็จ')
    }
  }

  if (authLoading) {
    return null
  }

  if (isConfigured && !user) {
    return (
      <AuthScreen
        onSubmit={handleEmailSignIn}
        onResetPassword={handleResetPassword}
        loading={authLoading}
        errorMessage={authError}
        infoMessage={authMessage}
      />
    )
  }

  if (!isHydrated || !currentProject) {
    return null
  }

  if (activeView === 'library') {
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
          description="ถ้าลบแล้วเรื่องนี้จะหายจากรายการ และถ้าเปิด sync ไว้จะถูกลบจาก cloud ด้วย"
          confirmLabel="ลบเรื่อง"
          cancelLabel="ยกเลิก"
          onConfirm={confirmDeleteStory}
          onCancel={clearPendingDeleteStory}
        />
      </>
    )
  }

  if (activeView === 'reader') {
    return (
      <SynopsisReader
        synopsis={readerSynopsis}
        completedCount={completedCount}
        showPointTitles={showPointTitlesInReader}
        onTogglePointTitles={() => setShowPointTitlesInReader((current) => !current)}
        onBack={closeReader}
        onCopy={copySynopsis}
      />
    )
  }

  if (activeView === 'storyline') {
    return (
      <StorylineWorkspace
        project={currentProject}
        onBack={closeStoryline}
        onChange={(value) => updateProjectField('storyline', value)}
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
        onClose={closeOutline}
        onSelectPoint={(pointId) => {
          selectPoint(pointId)
          closeOutline()
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
        onSelectPoint={selectPoint}
        onOpenSettings={() => setShouldOpenSettings(true)}
        onOpenStoryline={openStoryline}
        onOpenLibrary={openLibrary}
        onOpenReader={openReader}
        onOpenOutline={openOutline}
        onSignOut={signOut}
      />
    </>
  )
}

export default App
