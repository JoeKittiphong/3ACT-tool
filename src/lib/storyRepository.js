import { projectToPointRows, projectToStoryInsert, storyRowToProject } from './storyMapper'
import { isSupabaseConfigured, supabase } from './supabaseClient'

export async function fetchStoriesFromSupabase(userId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (storiesError) throw storiesError

  const storyIds = stories.map((story) => story.id)
  if (storyIds.length === 0) return []

  const { data: points, error: pointsError } = await supabase
    .from('story_points')
    .select('*')
    .in('story_id', storyIds)

  if (pointsError) throw pointsError

  return stories.map((story) =>
    storyRowToProject(
      story,
      points.filter((point) => point.story_id === story.id),
    ),
  )
}

export async function syncStoryToSupabase(project, userId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured')
  }

  const { error: storyError } = await supabase
    .from('stories')
    .upsert({
      id: project.id,
      user_id: userId,
      ...projectToStoryInsert(project),
    })

  if (storyError) throw storyError

  const pointRows = projectToPointRows(project).map((point) => ({
    ...point,
    user_id: userId,
  }))
  const { error: pointsError } = await supabase.from('story_points').upsert(pointRows, {
    onConflict: 'story_id, point_id',
  })

  if (pointsError) throw pointsError
}

export async function deleteStoryFromSupabase(projectId, userId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured')
  }

  const { error: storyError } = await supabase
    .from('stories')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId)

  if (storyError) throw storyError
}
