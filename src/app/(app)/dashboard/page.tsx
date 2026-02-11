import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { FileText, FolderOpen, Plus, ArrowRight, File } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import CollapsibleSection from '@/components/ui/CollapsibleSection'

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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/notes/new"
          className="bg-white border border-[#E8E3DE] rounded-2xl p-5 hover:shadow-warm-md hover:border-[#D4CFC8] transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FDF0ED] border border-[#F5D5CD] flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#E07862]" />
          </div>
          <div>
            <p className="text-[#2C2C2C] font-medium text-sm">Nouvelle note</p>
            <p className="text-[#9CA3AF] text-xs">Creer une note Markdown</p>
          </div>
        </Link>
        <Link
          href="/files"
          className="bg-white border border-[#E8E3DE] rounded-2xl p-5 hover:shadow-warm-md hover:border-[#D4CFC8] transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFF5EB] border border-[#F0D9C0] flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-[#D4924C]" />
          </div>
          <div>
            <p className="text-[#2C2C2C] font-medium text-sm">Gerer les fichiers</p>
            <p className="text-[#9CA3AF] text-xs">Upload et organisation</p>
          </div>
        </Link>
      </div>

      {/* Recent notes — collapsible */}
      <CollapsibleSection
        title="Notes recentes"
        icon={<FileText className="w-5 h-5 text-[#E07862]" />}
        count={notes.length}
        action={
          <Link
            href="/notes"
            className="text-[#E07862] text-xs hover:text-[#D4624C] transition-colors flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        }
      >
        {notes.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-8 h-8 text-[#D4CFC8] mx-auto mb-2" />
            <p className="text-[#9CA3AF] text-sm">Aucune note</p>
          </div>
        ) : (
          <div>
            {notes.map((note: { id: string; title: string; content: string; updated_at: string }, i: number) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-[#FAF8F5] transition-colors ${
                  i < notes.length - 1 ? 'border-b border-[#F0ECE6]' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[#2C2C2C] text-sm font-medium truncate">{note.title || 'Sans titre'}</p>
                  <p className="text-[#9CA3AF] text-xs mt-0.5 truncate">
                    {note.content ? note.content.substring(0, 80).replace(/[#*`]/g, '') : 'Note vide'}
                  </p>
                </div>
                <span className="text-[#B5B0A8] text-xs ml-4 shrink-0">
                  {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: fr })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* Recent files — collapsible */}
      <CollapsibleSection
        title="Fichiers recents"
        icon={<FolderOpen className="w-5 h-5 text-[#D4924C]" />}
        count={files.length}
        action={
          <Link
            href="/files"
            className="text-[#E07862] text-xs hover:text-[#D4624C] transition-colors flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        }
      >
        {files.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="w-8 h-8 text-[#D4CFC8] mx-auto mb-2" />
            <p className="text-[#9CA3AF] text-sm">Aucun fichier</p>
          </div>
        ) : (
          <div>
            {files.map((file: { id: string; name: string; size: number; created_at: string }, i: number) => (
              <div
                key={file.id}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < files.length - 1 ? 'border-b border-[#F0ECE6]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <File className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  <p className="text-[#2C2C2C] text-sm truncate">{file.name}</p>
                </div>
                <span className="text-[#B5B0A8] text-xs ml-4 shrink-0">
                  {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: fr })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  )
}
