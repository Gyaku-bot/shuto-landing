'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateNote, deleteNote } from '../actions'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Eye, Pencil, Trash2, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export default function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content || '')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(
    async (newTitle: string, newContent: string) => {
      setSaving(true)
      setSaved(false)
      await updateNote(note.id, { title: newTitle, content: newContent })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
    [note.id]
  )

  const debouncedSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => save(newTitle, newContent), 1000)
    },
    [save]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
    debouncedSave(newTitle, content)
  }

  function handleContentChange(newContent: string) {
    setContent(newContent)
    debouncedSave(title, newContent)
  }

  async function handleDelete() {
    await deleteNote(note.id)
    router.push('/notes')
    router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/notes')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex items-center gap-2">
          {saving && <span className="text-white/30 text-xs">Sauvegarde...</span>}
          {saved && (
            <span className="text-green-400 text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Sauvegardé
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreview(!preview)}
          >
            {preview ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? 'Éditer' : 'Aperçu'}
          </Button>

          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Titre de la note"
        className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/20 focus:outline-none mb-4 border-none"
      />

      {preview ? (
        <div className="prose prose-invert prose-indigo max-w-none bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*Aucun contenu*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Commencez à écrire en Markdown..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white/90 placeholder-white/20 focus:outline-none focus:border-indigo-500/30 resize-none min-h-[400px] text-sm leading-relaxed font-mono"
        />
      )}
    </div>
  )
}
