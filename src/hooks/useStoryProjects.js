import { useEffect, useMemo, useState } from 'react'
import {
  STORAGE_KEY,
  buildSynopsis,
  createProject,
  getCompletedCount,
  hasProjectContent,
  normalizeStore,
} from '../lib/storyStore'

export function useStoryProjects() {
  const [projects, setProjects] = useState([])
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [shouldOpenSettings, setShouldOpenSettings] = useState(false)

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

  const currentProject = useMemo(
    () => projects.find((project) => project.id === currentProjectId) ?? null,
    [currentProjectId, projects],
  )

  const completedCount = useMemo(() => getCompletedCount(currentProject), [currentProject])
  const synopsis = useMemo(() => buildSynopsis(currentProject), [currentProject])

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
    updateProjectField,
    updatePointContent,
    createAndOpenNewStory,
    duplicateStory,
    deleteStory,
    openStory,
  }
}
