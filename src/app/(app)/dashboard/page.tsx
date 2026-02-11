import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { FileText, FolderOpen, Plus, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [notesRes, filesRes] = await Promise.all([
    supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase
      .from('files')
      .select('*')
      .neq('mime_type', 'application/x-directory')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const notes = notesRes.data || []
  const files = filesRes.data || []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/notes/new"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Nouvelle note</p>
            <p className="text-white/40 text-xs">Créer une note Markdown</p>
          </div>
        </Link>
        <Link
          href="/files"
          className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Gérer les fichiers</p>
            <p className="text-white/40 text-xs">Upload et organisation</p>
          </div>
        </Link>
      </div>

      {/* Recent notes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Notes récentes</h3>
          <Link href="/notes" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {notes.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-white/40 text-sm">Aucune note</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {notes.map((note: { id: string; title: string; content: string; updated_at: string }) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{note.title || 'Sans titre'}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">
                    {note.content ? note.content.substring(0, 80).replace(/[#*`]/g, '') : 'Note vide'}
                  </p>
                </div>
                <span className="text-white/30 text-xs ml-4 shrink-0">
                  {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: fr })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent files */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Fichiers récents</h3>
          <Link href="/files" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {files.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FolderOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-white/40 text-sm">Aucun fichier</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {files.map((file: { id: string; name: string; size: number; created_at: string }) => (
              <div
                key={file.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FolderOpen className="w-5 h-5 text-white/40 shrink-0" />
                  <p className="text-white text-sm truncate">{file.name}</p>
                </div>
                <span className="text-white/30 text-xs ml-4 shrink-0">
                  {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: fr })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
