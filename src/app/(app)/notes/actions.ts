'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

export async function createNote() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title: 'Sans titre',
      content: '',
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/notes')
  return data
}

export async function updateNote(id: string, updates: { title?: string; content?: string }) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('notes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
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
