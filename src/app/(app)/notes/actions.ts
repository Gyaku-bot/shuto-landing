'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Notes ---

export async function getNotes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getNote(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createNote(folder: string = '') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const insertData: Record<string, unknown> = {
    user_id: user.id,
    title: 'Sans titre',
    content: '',
  }
  if (folder) insertData.folder = folder

  const { data, error } = await supabase
    .from('notes')
    .insert(insertData)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/notes')
  return data
}

export async function updateNote(
  id: string,
  updates: { title?: string; content?: string; folder?: string; pinned?: boolean; tags?: string[] },
) {
  const supabase = await createClient()
  // Only send title, content, updated_at as base — add optional fields if present
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.content !== undefined) payload.content = updates.content
  if (updates.folder !== undefined) payload.folder = updates.folder
  if (updates.pinned !== undefined) payload.pinned = updates.pinned
  if (updates.tags !== undefined) payload.tags = updates.tags

  const { error } = await supabase
    .from('notes')
    .update(payload)
    .eq('id', id)

  if (error) throw error
  revalidatePath('/notes')
}

export async function togglePin(id: string, pinned: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('notes')
    .update({ pinned, updated_at: new Date().toISOString() })
    .eq('id', id)

  // Silently fail if column doesn't exist yet
  if (error && !error.message.includes('column')) throw error
  revalidatePath('/notes')
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/notes')
}

// --- Note Folders ---

export async function getNoteFolders() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('note_folders')
    .select('*')
    .order('name', { ascending: true })

  if (error) return []
  return data
}

export async function createNoteFolder(name: string, parentFolder: string = '') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('note_folders')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', name)
    .eq('parent_folder', parentFolder)
    .maybeSingle()

  if (existing) return existing

  const { data, error } = await supabase
    .from('note_folders')
    .insert({ user_id: user.id, name, parent_folder: parentFolder })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/notes')
  return data
}

export async function deleteNoteFolder(id: string) {
  const supabase = await createClient()

  const { data: folder } = await supabase
    .from('note_folders')
    .select('name, parent_folder')
    .eq('id', id)
    .single()

  if (folder) {
    const fullPath = folder.parent_folder
      ? `${folder.parent_folder}/${folder.name}`
      : folder.name

    // Delete all notes in this folder
    await supabase.from('notes').delete().eq('folder', fullPath)

    // Delete sub-folders recursively
    const { data: children } = await supabase
      .from('note_folders')
      .select('id')
      .eq('parent_folder', fullPath)

    if (children) {
      for (const child of children) {
        await deleteNoteFolder(child.id)
      }
    }
  }

  await supabase.from('note_folders').delete().eq('id', id)
  revalidatePath('/notes')
}

// --- Tags ---

export async function getAllTags() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .select('tags')

  if (error) return []

  const tagSet = new Set<string>()
  for (const note of data || []) {
    if (note.tags) {
      for (const tag of note.tags) {
        tagSet.add(tag)
      }
    }
  }
  return Array.from(tagSet).sort()
}
