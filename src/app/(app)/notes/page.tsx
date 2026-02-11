import { getNotes } from './actions'
import NotesList from './NotesList'

export const dynamic = 'force-dynamic'

export default async function NotesPage() {
  const notes = await getNotes()
  return <NotesList initialNotes={notes} />
}
