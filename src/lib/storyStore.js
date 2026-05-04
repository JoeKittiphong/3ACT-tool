import { storyFramework } from '../storyFramework'

export const STORAGE_KEY = 'story-outline-3act-tool'

export const createEmptyPoints = () =>
  Object.fromEntries(storyFramework.map((point) => [point.id, '']))

export const createProject = () => {
  const timestamp = new Date().toISOString()

  return {
    id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: '',
    genre: '',
    logline: '',
    storyline: '',
    theme: '',
    points: createEmptyPoints(),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export const hasProjectContent = (project) => {
  if (!project) return false

  const fields = [project.title, project.genre, project.logline, project.storyline, project.theme]
  const hasFieldContent = fields.some((value) => (value ?? '').trim().length > 0)
  const hasPointContent = Object.values(project.points ?? {}).some(
    (value) => (value ?? '').trim().length > 0,
  )

  return hasFieldContent || hasPointContent
}

export const normalizeProject = (project) => ({
  ...createProject(),
  ...project,
  points: {
    ...createEmptyPoints(),
    ...(project.points ?? {}),
  },
  id: project.id ?? createProject().id,
  createdAt: project.createdAt ?? new Date().toISOString(),
  updatedAt: project.updatedAt ?? new Date().toISOString(),
})

export const normalizeStore = (raw) => {
  if (raw && Array.isArray(raw.projects)) {
    const projects = raw.projects.map(normalizeProject)
    const currentProjectId =
      projects.find((project) => project.id === raw.currentProjectId)?.id ?? projects[0]?.id ?? null

    return { projects, currentProjectId }
  }

  if (raw && typeof raw === 'object') {
    const migratedProject = normalizeProject(raw)
    return {
      projects: [migratedProject],
      currentProjectId: migratedProject.id,
    }
  }

  return {
    projects: [],
    currentProjectId: null,
  }
}

export const getCompletedCount = (project) => {
  if (!project) return 0

  return storyFramework.filter((point) => {
    const content = project.points?.[point.id] ?? ''
    return content.trim().length > 0
  }).length
}

export const buildSynopsis = (project, options = {}) => {
  if (!project) return ''

  const { includePointTitles = true } = options

  const sections = storyFramework
    .map((point) => {
      const content = project.points[point.id]?.trim()
      if (!content) return null
      return includePointTitles ? `${point.title}\n${content}` : content
    })
    .filter(Boolean)

  const projectHeader = [
    project.title.trim() ? `ชื่อเรื่อง: ${project.title.trim()}` : null,
    project.genre.trim() ? `แนว: ${project.genre.trim()}` : null,
    project.theme.trim() ? `ธีม: ${project.theme.trim()}` : null,
    project.logline.trim() ? `Logline: ${project.logline.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return [projectHeader, ...sections].filter(Boolean).join('\n\n')
}
