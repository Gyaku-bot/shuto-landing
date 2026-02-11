import { redirect } from 'next/navigation'
import { createNote } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NewNotePage() {
  const note = await createNote()
  redirect(`/notes/${note.id}`)
}
