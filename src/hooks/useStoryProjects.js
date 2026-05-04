import { useEffect, useMemo, useState } from 'react'
import {
  STORAGE_KEY,
  buildSynopsis,
  createProject,
  getCompletedCount,
  hasProjectContent,
  normalizeStore,
} from '../lib/storyStore'
import {
  deleteStoryFromSupabase,
  fetchStoriesFromSupabase,
  syncStoryToSupabase,
} from '../lib/storyRepository'

export function useStoryProjects({ user, syncEnabled }) {
  const [projects, setProjects] = useState([])
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [shouldOpenSettings, setShouldOpenSettings] = useState(false)
  const [syncStatus, setSyncStatus] = useState('local')
  const [hasRemoteBootstrapped, setHasRemoteBootstrapped] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const store = normalizeStore(parsed)

    if (store.projects.length === 0) {
      const firstProject = createProject()
      setProjects([firstProject])
      setCurrentProjectId(firstProject.id)
      setShouldOpenSettings(true)
      setIsHydrated(true)
      return
    }

    const currentProject = store.projects.find((project) => project.id === store.currentProjectId) ?? null
    setProjects(store.projects)
    setCurrentProjectId(store.currentProjectId)
    setShouldOpenSettings(!hasProjectContent(currentProject))
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        projects,
        currentProjectId,
      }),
    )
  }, [currentProjectId, isHydrated, projects])

  useEffect(() => {
    if (!isHydrated || !syncEnabled || !user?.id || hasRemoteBootstrapped) return

    let cancelled = false

    const bootstrap = async () => {
      try {
        setSyncStatus('syncing')
        const remoteProjects = await fetchStoriesFromSupabase(user.id)
        if (cancelled) return

        if (remoteProjects.length > 0) {
          setProjects(remoteProjects)
          const nextCurrentProject =
            remoteProjects.find((project) => project.id === currentProjectId) ?? remoteProjects[0]
          setCurrentProjectId(nextCurrentProject?.id ?? null)
          setShouldOpenSettings(nextCurrentProject ? !hasProjectContent(nextCurrentProject) : false)
        } else {
          const nonEmptyLocalProjects = projects.filter(hasProjectContent)
          for (const project of nonEmptyLocalProjects) {
            await syncStoryToSupabase(project, user.id)
          }
        }

        if (!cancelled) {
          setSyncStatus('synced')
          setHasRemoteBootstrapped(true)
        }
      } catch (error) {
        console.error('Failed to bootstrap stories from Supabase', error)
        if (!cancelled) {
          setSyncStatus('error')
          setHasRemoteBootstrapped(true)
        }
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [currentProjectId, hasRemoteBootstrapped, isHydrated, projects, syncEnabled, user?.id])

  const currentProject = useMemo(
    () => projects.find((project) => project.id === currentProjectId) ?? null,
    [currentProjectId, projects],
  )

  const completedCount = useMemo(() => getCompletedCount(currentProject), [currentProject])
  const synopsis = useMemo(() => buildSynopsis(currentProject), [currentProject])

  useEffect(() => {
    if (!isHydrated || !syncEnabled || !user?.id || !hasRemoteBootstrapped || !currentProject) return

    const timeoutId = window.setTimeout(async () => {
      try {
        setSyncStatus('syncing')
        await syncStoryToSupabase(currentProject, user.id)
        setSyncStatus('synced')
      } catch (error) {
        console.error('Failed to sync story to Supabase', error)
        setSyncStatus('error')
      }
    }, 900)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [currentProject, hasRemoteBootstrapped, isHydrated, syncEnabled, user?.id])

  const updateCurrentProject = (updater) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id !== currentProjectId) return project

        const nextProject = typeof updater === 'function' ? updater(project) : updater
        return {
          ...nextProject,
          updatedAt: new Date().toISOString(),
        }
      }),
    )
  }

  const updateProjectField = (field, value) => {
    updateCurrentProject((project) => ({
      ...project,
      [field]: value,
    }))
  }

  const updatePointContent = (pointId, value) => {
    updateCurrentProject((project) => ({
      ...project,
      points: {
        ...project.points,
        [pointId]: value,
      },
    }))
  }

  const createAndOpenNewStory = () => {
    const project = createProject()
    setProjects((currentProjects) => [project, ...currentProjects])
    setCurrentProjectId(project.id)
    setShouldOpenSettings(true)
    return project
  }

  const duplicateStory = (projectId) => {
    const sourceProject = projects.find((project) => project.id === projectId)
    if (!sourceProject) return null

    const duplicatedProject = {
      ...createProject(),
      title: sourceProject.title ? `${sourceProject.title} Copy` : 'Untitled Story Copy',
      genre: sourceProject.genre,
      logline: sourceProject.logline,
      theme: sourceProject.theme,
      points: {
        ...sourceProject.points,
      },
    }

    setProjects((currentProjects) => [duplicatedProject, ...currentProjects])
    setCurrentProjectId(duplicatedProject.id)
    setShouldOpenSettings(false)
    return duplicatedProject
  }

  const deleteStory = (projectId) => {
    if (syncEnabled && user?.id) {
      deleteStoryFromSupabase(projectId, user.id).catch((error) => {
        console.error('Failed to delete story from Supabase', error)
        setSyncStatus('error')
      })
    }

    const remainingProjects = projects.filter((project) => project.id !== projectId)

    if (remainingProjects.length === 0) {
      const replacementProject = createProject()
      setProjects([replacementProject])
      setCurrentProjectId(replacementProject.id)
      setShouldOpenSettings(true)
      return replacementProject
    }

    setProjects(remainingProjects)

    if (projectId === currentProjectId) {
      const nextCurrentProject = remainingProjects[0]
      setCurrentProjectId(nextCurrentProject.id)
      setShouldOpenSettings(!hasProjectContent(nextCurrentProject))
      return nextCurrentProject
    }

    return null
  }

  const openStory = (projectId) => {
    const project = projects.find((item) => item.id === projectId) ?? null
    setCurrentProjectId(projectId)
    setShouldOpenSettings(project ? !hasProjectContent(project) : false)
  }

  return {
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
    duplicateStory,
    deleteStory,
    openStory,
  }
}
