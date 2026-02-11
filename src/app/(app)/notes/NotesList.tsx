'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNote, deleteNote, createNoteFolder, deleteNoteFolder, togglePin } from './actions'
import {
  Plus, Trash2, FileText, Search, Clock, StickyNote, Pin,
  FolderOpen, FolderPlus, ChevronRight, ChevronDown,
  Tag, X, LayoutGrid, List, ArrowUpDown,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

interface Note {
  id: string
  title: string
  content: string
  folder: string
  pinned: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

interface NoteFolder {
  id: string
  name: string
  parent_folder: string
  created_at: string
}

type SortMode = 'updated' | 'created' | 'title'
type ViewMode = 'grid' | 'list'

const accentColors = [
  'border-t-[#E07862]',
  'border-t-[#D4924C]',
  'border-t-[#7D9B76]',
  'border-t-[#D4A574]',
  'border-t-[#C4727A]',
  'border-t-[#8B9FC2]',
  'border-t-[#B8876F]',
  'border-t-[#9B8EC4]',
]

const iconAccents = [
  { bg: 'bg-[#FDF0ED]', border: 'border-[#F5D5CD]', text: 'text-[#E07862]' },
  { bg: 'bg-[#FFF5EB]', border: 'border-[#F0D9C0]', text: 'text-[#D4924C]' },
  { bg: 'bg-[#F0F5EE]', border: 'border-[#D5E5D0]', text: 'text-[#7D9B76]' },
  { bg: 'bg-[#FFF5EB]', border: 'border-[#F0DCC8]', text: 'text-[#D4A574]' },
  { bg: 'bg-[#FDF0F2]', border: 'border-[#F5CDD2]', text: 'text-[#C4727A]' },
  { bg: 'bg-[#EEF1F6]', border: 'border-[#D0D8E8]', text: 'text-[#8B9FC2]' },
  { bg: 'bg-[#F6F0EC]', border: 'border-[#E5D5C8]', text: 'text-[#B8876F]' },
  { bg: 'bg-[#F2EFF6]', border: 'border-[#D8D0E8]', text: 'text-[#9B8EC4]' },
]

const tagColors = [
  { bg: 'bg-[#FDF0ED]', text: 'text-[#E07862]' },
  { bg: 'bg-[#F0F5EE]', text: 'text-[#7D9B76]' },
  { bg: 'bg-[#EEF1F6]', text: 'text-[#8B9FC2]' },
  { bg: 'bg-[#F2EFF6]', text: 'text-[#9B8EC4]' },
  { bg: 'bg-[#FFF5EB]', text: 'text-[#D4924C]' },
  { bg: 'bg-[#FDF0F2]', text: 'text-[#C4727A]' },
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getTagColor(tag: string) {
  return tagColors[hashString(tag) % tagColors.length]
}

interface FolderNode {
  id: string
  name: string
  parent_folder: string
  fullPath: string
  noteCount: number
  children: FolderNode[]
}

function buildFolderTree(folders: NoteFolder[], noteCounts: Record<string, number>): FolderNode[] {
  const roots: FolderNode[] = []
  const map = new Map<string, FolderNode>()

  for (const f of folders) {
    const fullPath = f.parent_folder ? `${f.parent_folder}/${f.name}` : f.name
    map.set(f.id, { id: f.id, name: f.name, parent_folder: f.parent_folder, children: [], fullPath, noteCount: noteCounts[fullPath] || 0 })
  }

  for (const node of map.values()) {
    if (!node.parent_folder) {
      roots.push(node)
    } else {
      let found = false
      for (const potential of map.values()) {
        if (potential.fullPath === node.parent_folder) {
          potential.children.push(node)
          found = true
          break
        }
      }
      if (!found) roots.push(node)
    }
  }

  return roots
}

export default function NotesList({
  initialNotes,
  initialFolders,
  initialTags,
}: {
  initialNotes: Note[]
  initialFolders: NoteFolder[]
  initialTags: string[]
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [sort, setSort] = useState<SortMode>('updated')
  const [view, setView] = useState<ViewMode>('grid')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [folderModal, setFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Count notes per folder
  const noteCounts: Record<string, number> = {}
  for (const note of initialNotes) {
    const f = note.folder || ''
    noteCounts[f] = (noteCounts[f] || 0) + 1
  }
  const pinnedCount = initialNotes.filter((n) => n.pinned).length
  const folderTree = buildFolderTree(initialFolders, noteCounts)

  // Filter & sort
  let filtered = [...initialNotes]

  if (activeFolder !== null) {
    filtered = filtered.filter((n) => (n.folder || '') === activeFolder)
  }
  if (showPinnedOnly) {
    filtered = filtered.filter((n) => n.pinned)
  }
  if (activeTags.length > 0) {
    filtered = filtered.filter((n) =>
      n.tags && activeTags.every((t) => n.tags.includes(t)),
    )
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q)),
    )
  }

  // Sort: pinned first, then by sort mode
  filtered.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    if (sort === 'title') return (a.title || '').localeCompare(b.title || '')
    if (sort === 'created') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

  async function handleCreate() {
    const note = await createNote(activeFolder || '')
    router.push(`/notes/${note.id}`)
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    e.preventDefault()
    await deleteNote(id)
    router.refresh()
  }

  async function handleTogglePin(e: React.MouseEvent, id: string, pinned: boolean) {
    e.stopPropagation()
    e.preventDefault()
    await togglePin(id, !pinned)
    router.refresh()
  }

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return
    await createNoteFolder(newFolderName.trim(), activeFolder || '')
    setNewFolderName('')
    setFolderModal(false)
    router.refresh()
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function toggleFolderExpand(folderId: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) next.delete(folderId)
      else next.add(folderId)
      return next
    })
  }

  function clearFilters() {
    setActiveFolder(null)
    setActiveTags([])
    setShowPinnedOnly(false)
    setSearch('')
  }

  const hasActiveFilters = activeFolder !== null || activeTags.length > 0 || showPinnedOnly

  // --- Render folder tree ---
  function renderFolderNode(node: FolderNode) {
    const isExpanded = expandedFolders.has(node.id)
    const isActive = activeFolder === node.fullPath
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer group transition-colors ${
            isActive ? 'bg-[#FDF0ED] text-[#E07862]' : 'text-[#717171] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]'
          }`}
          onClick={() => setActiveFolder(isActive ? null : node.fullPath)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleFolderExpand(node.id) }}
              className="p-0.5 -ml-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <FolderOpen className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#E07862]' : 'text-[#D4924C]'}`} />
          <span className="truncate flex-1">{node.name}</span>
          {node.noteCount > 0 && (
            <span className="text-xs text-[#B5B0A8]">{node.noteCount}</span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-3 mt-0.5">
            {node.children.map((child) => renderFolderNode(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Notes</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            {initialNotes.length} note{initialNotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setFolderModal(true)}>
            <FolderPlus className="w-4 h-4" />
            Dossier
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            Nouvelle note
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* --- Sidebar --- */}
        <div className="w-56 flex-shrink-0">
          <div className="sticky top-4 space-y-1">
            {/* All notes */}
            <button
              onClick={() => { setActiveFolder(null); setShowPinnedOnly(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                activeFolder === null && !showPinnedOnly
                  ? 'bg-[#FDF0ED] text-[#E07862] font-medium'
                  : 'text-[#717171] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]'
              }`}
            >
              <StickyNote className="w-4 h-4" />
              Toutes les notes
              <span className="ml-auto text-xs text-[#B5B0A8]">{initialNotes.length}</span>
            </button>

            {/* Pinned */}
            {pinnedCount > 0 && (
              <button
                onClick={() => { setShowPinnedOnly(!showPinnedOnly); setActiveFolder(null) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                  showPinnedOnly
                    ? 'bg-[#FDF0ED] text-[#E07862] font-medium'
                    : 'text-[#717171] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]'
                }`}
              >
                <Pin className="w-4 h-4" />
                Epinglees
                <span className="ml-auto text-xs text-[#B5B0A8]">{pinnedCount}</span>
              </button>
            )}

            {/* Root-level notes (no folder) */}
            <button
              onClick={() => setActiveFolder('')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                activeFolder === ''
                  ? 'bg-[#FDF0ED] text-[#E07862] font-medium'
                  : 'text-[#717171] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Sans dossier
              <span className="ml-auto text-xs text-[#B5B0A8]">{noteCounts[''] || 0}</span>
            </button>

            {/* Folders */}
            {folderTree.length > 0 && (
              <>
                <div className="pt-3 pb-1 px-3">
                  <p className="text-[10px] font-semibold text-[#B5B0A8] uppercase tracking-wider">Dossiers</p>
                </div>
                {folderTree.map((node) => renderFolderNode(node))}
              </>
            )}

            {/* Tags */}
            {initialTags.length > 0 && (
              <>
                <div className="pt-4 pb-1 px-3">
                  <p className="text-[10px] font-semibold text-[#B5B0A8] uppercase tracking-wider">Tags</p>
                </div>
                <div className="flex flex-wrap gap-1.5 px-2">
                  {initialTags.map((tag) => {
                    const color = getTagColor(tag)
                    const isActive = activeTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                          isActive
                            ? `${color.bg} ${color.text} ring-1 ring-current/20`
                            : 'bg-[#F5F3F0] text-[#9CA3AF] hover:text-[#717171]'
                        }`}
                      >
                        # {tag}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- Main content --- */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5B0A8]" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#E8E3DE] rounded-xl pl-9 pr-4 py-2 text-sm text-[#2C2C2C] placeholder-[#B5B0A8] focus:outline-none focus:border-[#E07862]/50 transition-colors shadow-warm-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E3DE] text-sm text-[#717171] hover:text-[#2C2C2C] transition-colors shadow-warm-sm"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sort === 'updated' ? 'Modifie' : sort === 'created' ? 'Cree' : 'Titre'}
              </button>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E3DE] rounded-xl shadow-warm-md z-20 py-1 w-40">
                    {([['updated', 'Derniere modif.'], ['created', 'Date de creation'], ['title', 'Titre A-Z']] as [SortMode, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setSort(key); setShowSortMenu(false) }}
                        className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                          sort === key ? 'text-[#E07862] bg-[#FDF0ED]' : 'text-[#717171] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-[#E8E3DE] rounded-xl overflow-hidden shadow-warm-sm">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#FDF0ED] text-[#E07862]' : 'text-[#9CA3AF] hover:text-[#717171]'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors ${view === 'list' ? 'bg-[#FDF0ED] text-[#E07862]' : 'text-[#9CA3AF] hover:text-[#717171]'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filters bar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {activeFolder !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF5EB] text-[#D4924C] rounded-lg text-xs">
                  <FolderOpen className="w-3 h-3" />
                  {activeFolder || 'Sans dossier'}
                  <button onClick={() => setActiveFolder(null)} className="ml-0.5 hover:text-[#B8876F]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {showPinnedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FDF0ED] text-[#E07862] rounded-lg text-xs">
                  <Pin className="w-3 h-3" />
                  Epinglees
                  <button onClick={() => setShowPinnedOnly(false)} className="ml-0.5 hover:text-[#D4624C]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {activeTags.map((tag) => {
                const color = getTagColor(tag)
                return (
                  <span key={tag} className={`inline-flex items-center gap-1 px-2.5 py-1 ${color.bg} ${color.text} rounded-lg text-xs`}>
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="ml-0.5 opacity-70 hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
              <button onClick={clearFilters} className="text-xs text-[#9CA3AF] hover:text-[#717171] transition-colors">
                Tout effacer
              </button>
            </div>
          )}

          {/* Notes display */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              {search ? (
                <>
                  <Search className="w-10 h-10 text-[#D4CFC8] mx-auto mb-4" />
                  <p className="text-[#717171]">Aucun resultat pour &laquo; {search} &raquo;</p>
                </>
              ) : initialNotes.length === 0 ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E3DE] flex items-center justify-center mx-auto mb-5 shadow-warm-sm">
                    <StickyNote className="w-8 h-8 text-[#D4CFC8]" />
                  </div>
                  <p className="text-[#717171] mb-1 font-medium">Aucune note</p>
                  <p className="text-[#9CA3AF] text-sm mb-6">Commencez par creer votre premiere note</p>
                  <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    Creer une note
                  </Button>
                </>
              ) : (
                <>
                  <FolderOpen className="w-10 h-10 text-[#D4CFC8] mx-auto mb-4" />
                  <p className="text-[#717171]">Aucune note dans cette vue</p>
                </>
              )}
            </div>
          ) : view === 'grid' ? (
            /* --- Grid (masonry) view --- */
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {filtered.map((note) => {
                const contentLength = note.content?.length || 0
                const previewLength = contentLength > 500 ? 350 : contentLength > 200 ? 200 : 80
                const previewClamp = contentLength > 500 ? 'line-clamp-[10]' : contentLength > 200 ? 'line-clamp-6' : 'line-clamp-3'
                const colorIndex = hashString(note.id) % accentColors.length
                const accent = accentColors[colorIndex]
                const iconAccent = iconAccents[colorIndex]

                return (
                  <div
                    key={note.id}
                    onClick={() => router.push(`/notes/${note.id}`)}
                    className={`break-inside-avoid mb-4 bg-white border border-[#E8E3DE] border-t-2 ${accent} rounded-2xl p-5 cursor-pointer group transition-all duration-300 ease-out hover:shadow-warm-md hover:border-[#D4CFC8] hover:-translate-y-1`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl ${iconAccent.bg} border ${iconAccent.border} flex items-center justify-center flex-shrink-0`}>
                          <FileText className={`w-3.5 h-3.5 ${iconAccent.text}`} />
                        </div>
                        {note.pinned && (
                          <Pin className="w-3.5 h-3.5 text-[#E07862] fill-[#E07862]" />
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleTogglePin(e, note.id, note.pinned)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            note.pinned
                              ? 'text-[#E07862] hover:bg-[#FDF0ED]'
                              : 'text-[#D4CFC8] hover:text-[#E07862] hover:bg-[#FDF0ED]'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, note.id)}
                          className="p-1.5 rounded-lg text-[#D4CFC8] hover:text-[#DC6B6B] hover:bg-[#FDF0F0] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-[#2C2C2C] font-semibold text-sm leading-tight">
                      {note.title || 'Sans titre'}
                    </h3>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => {
                          const color = getTagColor(tag)
                          return (
                            <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] ${color.bg} ${color.text}`}>
                              {tag}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    {note.content ? (
                      <div className={`${previewClamp} mt-2 text-xs leading-relaxed overflow-hidden prose max-w-none prose-headings:text-[#555555] prose-headings:text-xs prose-headings:font-medium prose-headings:my-1 prose-p:text-[#9CA3AF] prose-p:text-xs prose-p:my-0.5 prose-strong:text-[#717171] prose-code:text-[#E07862]/60 prose-code:text-[10px] prose-li:text-[#9CA3AF] prose-li:text-xs prose-li:my-0 prose-a:text-[#E07862]/60 prose-a:no-underline prose-ul:my-1 prose-ol:my-1`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.content.substring(0, previewLength)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-[#B5B0A8] text-xs mt-2 italic">Note vide</p>
                    )}

                    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#F0ECE6]">
                      <Clock className="w-3 h-3 text-[#B5B0A8]" />
                      <span className="text-[#B5B0A8] text-xs">
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: fr })}
                      </span>
                      {note.folder && (
                        <>
                          <span className="text-[#E8E3DE] mx-1">|</span>
                          <FolderOpen className="w-3 h-3 text-[#B5B0A8]" />
                          <span className="text-[#B5B0A8] text-xs truncate">{note.folder}</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* --- List view --- */
            <div className="bg-white border border-[#E8E3DE] rounded-2xl overflow-hidden shadow-warm-sm">
              {filtered.map((note, i) => (
                <div
                  key={note.id}
                  onClick={() => router.push(`/notes/${note.id}`)}
                  className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer group hover:bg-[#FAF8F5] transition-colors ${
                    i < filtered.length - 1 ? 'border-b border-[#F0ECE6]' : ''
                  }`}
                >
                  {note.pinned && <Pin className="w-3.5 h-3.5 text-[#E07862] fill-[#E07862] flex-shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-[#2C2C2C] text-sm font-medium truncate">{note.title || 'Sans titre'}</p>
                    <p className="text-[#9CA3AF] text-xs truncate mt-0.5">
                      {note.content ? note.content.substring(0, 100).replace(/[#*`]/g, '') : 'Note vide'}
                    </p>
                  </div>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 flex-shrink-0">
                      {note.tags.slice(0, 2).map((tag) => {
                        const color = getTagColor(tag)
                        return (
                          <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] ${color.bg} ${color.text}`}>
                            {tag}
                          </span>
                        )
                      })}
                      {note.tags.length > 2 && (
                        <span className="text-[10px] text-[#B5B0A8]">+{note.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                  {note.folder && (
                    <span className="text-[#B5B0A8] text-xs flex-shrink-0 flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {note.folder.split('/').pop()}
                    </span>
                  )}
                  <span className="text-[#B5B0A8] text-xs flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: fr })}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => handleTogglePin(e, note.id, note.pinned)}
                      className={`p-1 rounded-lg transition-colors ${
                        note.pinned ? 'text-[#E07862]' : 'text-[#D4CFC8] hover:text-[#E07862]'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, note.id)}
                      className="p-1 rounded-lg text-[#D4CFC8] hover:text-[#DC6B6B] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Folder creation modal */}
      <Modal open={folderModal} onClose={() => setFolderModal(false)} title="Nouveau dossier de notes">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateFolder() }}>
          {activeFolder && (
            <p className="text-xs text-[#9CA3AF] mb-3 flex items-center gap-1">
              <FolderOpen className="w-3 h-3" />
              Dans : {activeFolder}
            </p>
          )}
          <Input
            placeholder="Nom du dossier"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" type="button" onClick={() => setFolderModal(false)}>
              Annuler
            </Button>
            <Button type="submit">Creer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
