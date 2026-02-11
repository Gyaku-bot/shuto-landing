import { getNotes, getNoteFolders, getAllTags } from './actions'
import NotesList from './NotesList'

export const dynamic = 'force-dynamic'

export default async function NotesPage() {
  const [notes, folders, tags] = await Promise.all([
    getNotes(),
    getNoteFolders(),
    getAllTags(),
  ])

  return <NotesList initialNotes={notes} initialFolders={folders} initialTags={tags} />
}
