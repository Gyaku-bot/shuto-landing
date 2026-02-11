'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getFiles(folder: string = '') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('folder', folder)
    .order('mime_type', { ascending: true }) // folders first (application/x-directory)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function uploadFile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || ''

  const storagePath = `${user.id}/${folder ? folder + '/' : ''}${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('user-files')
    .upload(storagePath, file)

  if (uploadError) throw uploadError

  const { error: dbError } = await supabase.from('files').insert({
    user_id: user.id,
    name: file.name,
    storage_path: storagePath,
    size: file.size,
    mime_type: file.type,
    folder,
  })

  if (dbError) throw dbError
  revalidatePath('/files')
}

export async function createFolder(name: string, parentFolder: string = '') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const folderPath = parentFolder ? `${parentFolder}/${name}` : name

  const { error } = await supabase.from('files').insert({
    user_id: user.id,
    name,
    storage_path: '',
    size: 0,
    mime_type: 'application/x-directory',
    folder: parentFolder,
  })

  if (error) throw error
  revalidatePath('/files')
  return folderPath
}

export async function deleteFile(id: string, storagePath: string, isFolder: boolean) {
  const supabase = await createClient()

  if (!isFolder && storagePath) {
    await supabase.storage.from('user-files').remove([storagePath])
  }

  if (isFolder) {
    // Get the folder name and parent to build the full path
    const { data: folderData } = await supabase
      .from('files')
      .select('name, folder')
      .eq('id', id)
      .single()

    if (folderData) {
      const fullPath = folderData.folder
        ? `${folderData.folder}/${folderData.name}`
        : folderData.name

      // Recursively delete contents
      const { data: children } = await supabase
        .from('files')
        .select('id, storage_path, mime_type')
        .eq('folder', fullPath)

      if (children) {
        for (const child of children) {
          await deleteFile(child.id, child.storage_path, child.mime_type === 'application/x-directory')
        }
      }
    }
  }

  const { error } = await supabase.from('files').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/files')
}

export async function getSignedUrl(storagePath: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('user-files')
    .createSignedUrl(storagePath, 60)

  if (error) throw error
  return data.signedUrl
}
