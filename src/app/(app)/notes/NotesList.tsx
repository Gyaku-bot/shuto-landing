'use client'

import { useRouter } from 'next/navigation'
import { createNote, deleteNote } from './actions'
import { Plus, Trash2, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Button from '@/components/ui/Button'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export default function NotesList({ initialNotes }: { initialNotes: Note[] }) {
  const router = useRouter()

  async function handleCreate() {
    const note = await createNote()
    router.push(`/notes/${note.id}`)
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    e.preventDefault()
    await deleteNote(id)
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">{initialNotes.length} note{initialNotes.length !== 1 ? 's' : ''}</p>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Nouvelle note
        </Button>
      </div>

      {initialNotes.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-4">Aucune note</p>
          <Button onClick={handleCreate} variant="secondary">
            <Plus className="w-4 h-4" />
            Créer une note
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {initialNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => router.push(`/notes/${note.id}`)}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all group w-full"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium truncate">
                    {note.title || 'Sans titre'}
                  </h3>
                  <p className="text-white/40 text-sm mt-1 line-clamp-2">
                    {note.content
                      ? note.content.substring(0, 150).replace(/[#*`]/g, '')
                      : 'Note vide'}
                  </p>
                  <p className="text-white/30 text-xs mt-2">
                    {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: fr })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, note.id)}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
