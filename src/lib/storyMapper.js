import { createEmptyPoints } from './storyStore'

export function storyRowToProject(storyRow, pointRows = []) {
  const points = createEmptyPoints()

  for (const point of pointRows) {
    if (point.point_id in points) {
      points[point.point_id] = point.content ?? ''
    }
  }

  return {
    id: storyRow.id,
    title: storyRow.title ?? '',
    genre: storyRow.genre ?? '',
    logline: storyRow.logline ?? '',
    storyline: storyRow.storyline ?? '',
    theme: storyRow.theme ?? '',
    points,
    createdAt: storyRow.created_at,
    updatedAt: storyRow.updated_at,
  }
}

export function projectToStoryInsert(project) {
  return {
    title: project.title,
    genre: project.genre,
    logline: project.logline,
    storyline: project.storyline,
    theme: project.theme,
  }
}

export function projectToPointRows(project) {
  return Object.entries(project.points).map(([pointId, content]) => ({
    story_id: project.id,
    point_id: pointId,
    content,
  }))
}
