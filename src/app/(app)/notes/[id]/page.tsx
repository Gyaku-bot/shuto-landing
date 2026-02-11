import { getNote } from '../actions'
import NoteEditor from './NoteEditor'

export const dynamic = 'force-dynamic'

export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = await getNote(id)
  return <NoteEditor note={note} />
}
