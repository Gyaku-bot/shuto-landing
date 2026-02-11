'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateNote, deleteNote, togglePin } from '../actions'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowLeft, Trash2, Check, Pin, Download,
  Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare,
  Code, Quote, Link, Minus,
  Columns2, Tag, X, FolderOpen,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

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

interface ToolbarItem {
  icon: React.ElementType
  label: string
  action: 'wrap' | 'prefix' | 'insert'
  before?: string
  after?: string
  prefix?: string
  insert?: string
}

interface ToolbarSeparator {
  type: 'separator'
}

type ToolbarEntry = ToolbarItem | ToolbarSeparator

const toolbarItems: ToolbarEntry[] = [
  { icon: Bold, label: 'Gras', action: 'wrap', before: '**', after: '**' },
  { icon: Italic, label: 'Italique', action: 'wrap', before: '_', after: '_' },
  { icon: Strikethrough, label: 'Barre', action: 'wrap', before: '~~', after: '~~' },
  { type: 'separator' },
  { icon: Heading1, label: 'Titre 1', action: 'prefix', prefix: '# ' },
  { icon: Heading2, label: 'Titre 2', action: 'prefix', prefix: '## ' },
  { icon: Heading3, label: 'Titre 3', action: 'prefix', prefix: '### ' },
  { type: 'separator' },
  { icon: List, label: 'Liste', action: 'prefix', prefix: '- ' },
  { icon: ListOrdered, label: 'Liste numerotee', action: 'prefix', prefix: '1. ' },
  { icon: CheckSquare, label: 'Checklist', action: 'prefix', prefix: '- [ ] ' },
  { type: 'separator' },
  { icon: Code, label: 'Code', action: 'wrap', before: '`', after: '`' },
  { icon: Quote, label: 'Citation', action: 'prefix', prefix: '> ' },
  { icon: Link, label: 'Lien', action: 'wrap', before: '[', after: '](url)' },
  { icon: Minus, label: 'Separateur', action: 'insert', insert: '\n---\n' },
]

type ViewMode = 'write' | 'preview' | 'split'

export default function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content || '')
  const [pinned, setPinned] = useState(note.pinned || false)
  const [tags, setTags] = useState<string[]>(note.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('write')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const save = useCallback(
    async (newTitle: string, newContent: string, newTags?: string[], newPinned?: boolean) => {
      setSaving(true)
      setSaved(false)
      const updates: Record<string, unknown> = { title: newTitle, content: newContent }
      if (newTags !== undefined) updates.tags = newTags
      if (newPinned !== undefined) updates.pinned = newPinned
      await updateNote(note.id, updates as { title: string; content: string; tags?: string[]; pinned?: boolean })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
    [note.id],
  )

  const debouncedSave = useCallback(
    (newTitle: string, newContent: string, newTags?: string[], newPinned?: boolean) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => save(newTitle, newContent, newTags, newPinned), 1000)
    },
    [save],
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea && viewMode !== 'preview') {
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(500, textarea.scrollHeight) + 'px'
    }
  }, [content, viewMode])

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
    debouncedSave(newTitle, content, tags, pinned)
  }

  function handleContentChange(newContent: string) {
    setContent(newContent)
    debouncedSave(title, newContent, tags, pinned)
  }

  async function handleTogglePin() {
    const newPinned = !pinned
    setPinned(newPinned)
    await togglePin(note.id, newPinned)
  }

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag || tags.includes(tag)) { setTagInput(''); return }
    const newTags = [...tags, tag]
    setTags(newTags)
    setTagInput('')
    debouncedSave(title, content, newTags, pinned)
  }

  function handleRemoveTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
    debouncedSave(title, content, newTags, pinned)
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1])
    }
  }

  async function handleExportPdf() {
    setExporting(true)
    try {
      const [html2pdfModule, markedModule] = await Promise.all([
        import('html2pdf.js'),
        import('marked'),
      ])
      const html2pdf = html2pdfModule.default
      const { marked } = markedModule

      const htmlContent = await marked(content || '')

      const element = document.createElement('div')
      element.innerHTML = `
        <div style="font-family: system-ui, -apple-system, sans-serif; color: #2C2C2C; padding: 20px;">
          <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; line-height: 1.3;">${title || 'Sans titre'}</h1>
          ${note.folder ? `<p style="font-size: 12px; color: #9CA3AF; margin-bottom: 4px;">📁 ${note.folder}</p>` : ''}
          ${tags.length > 0 ? `<p style="font-size: 12px; color: #9CA3AF; margin-bottom: 16px;">${tags.map(t => `#${t}`).join(' ')}</p>` : '<div style="margin-bottom: 16px;"></div>'}
          <hr style="border: none; border-top: 1px solid #E8E3DE; margin-bottom: 20px;" />
          <div style="font-size: 14px; line-height: 1.8; color: #555555;">
            ${htmlContent}
          </div>
        </div>
      `

      document.body.appendChild(element)
      await html2pdf().from(element).set({
        margin: [10, 10],
        filename: `${title || 'note'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4' },
      }).save()
      document.body.removeChild(element)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
    setExporting(false)
  }

  function handleToolbarAction(item: ToolbarItem) {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newContent: string
    let newCursorPos: number

    switch (item.action) {
      case 'wrap': {
        if (selectedText) {
          const wrappedText = `${item.before}${selectedText}${item.after}`
          newContent = content.substring(0, start) + wrappedText + content.substring(end)
          newCursorPos = start + wrappedText.length
        } else {
          const wrappedText = `${item.before}${item.label}${item.after}`
          newContent = content.substring(0, start) + wrappedText + content.substring(end)
          const selectStart = start + item.before!.length
          const selectEnd = selectStart + item.label.length
          setContent(newContent)
          debouncedSave(title, newContent, tags, pinned)
          requestAnimationFrame(() => {
            textarea.focus()
            textarea.setSelectionRange(selectStart, selectEnd)
          })
          return
        }
        break
      }
      case 'prefix': {
        const lineStart = content.lastIndexOf('\n', start - 1) + 1
        const lineEnd = content.indexOf('\n', start)
        const actualLineEnd = lineEnd === -1 ? content.length : lineEnd
        const currentLine = content.substring(lineStart, actualLineEnd)

        if (currentLine.startsWith(item.prefix!)) {
          newContent = content.substring(0, lineStart) + currentLine.substring(item.prefix!.length) + content.substring(actualLineEnd)
          newCursorPos = Math.max(lineStart, start - item.prefix!.length)
        } else {
          newContent = content.substring(0, lineStart) + item.prefix + content.substring(lineStart)
          newCursorPos = start + item.prefix!.length
        }
        break
      }
      case 'insert': {
        newContent = content.substring(0, start) + item.insert + content.substring(end)
        newCursorPos = start + item.insert!.length
        break
      }
      default:
        return
    }

    setContent(newContent)
    debouncedSave(title, newContent, tags, pinned)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget

    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault()
      const item = toolbarItems.find((t) => !('type' in t) && t.icon === Bold) as ToolbarItem
      if (item) handleToolbarAction(item)
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault()
      const item = toolbarItems.find((t) => !('type' in t) && t.icon === Italic) as ToolbarItem
      if (item) handleToolbarAction(item)
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      const item = toolbarItems.find((t) => !('type' in t) && t.icon === Link) as ToolbarItem
      if (item) handleToolbarAction(item)
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + '  ' + content.substring(end)
      setContent(newContent)
      debouncedSave(title, newContent, tags, pinned)
      requestAnimationFrame(() => {
        textarea.setSelectionRange(start + 2, start + 2)
      })
    }
  }

  async function handleDelete() {
    await deleteNote(note.id)
    router.push('/notes')
    router.refresh()
  }

  const tagColors = [
    { bg: 'bg-[#FDF0ED]', text: 'text-[#E07862]' },
    { bg: 'bg-[#F0F5EE]', text: 'text-[#7D9B76]' },
    { bg: 'bg-[#EEF1F6]', text: 'text-[#8B9FC2]' },
    { bg: 'bg-[#F2EFF6]', text: 'text-[#9B8EC4]' },
    { bg: 'bg-[#FFF5EB]', text: 'text-[#D4924C]' },
    { bg: 'bg-[#FDF0F2]', text: 'text-[#C4727A]' },
  ]

  function getTagColor(tag: string) {
    let hash = 0
    for (let i = 0; i < tag.length; i++) {
      hash = ((hash << 5) - hash) + tag.charCodeAt(i)
      hash |= 0
    }
    return tagColors[Math.abs(hash) % tagColors.length]
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push('/notes')}
          className="flex items-center gap-2 text-[#717171] hover:text-[#2C2C2C] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-[#B5B0A8] text-xs animate-pulse">Sauvegarde...</span>
          )}
          {saved && (
            <span className="text-[#6B9E6B] text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Sauvegarde
            </span>
          )}
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded-xl transition-colors ${
              pinned
                ? 'bg-[#FDF0ED] text-[#E07862] border border-[#F5D5CD]'
                : 'text-[#9CA3AF] hover:text-[#E07862] hover:bg-[#FDF0ED] border border-transparent'
            }`}
            title={pinned ? 'Desepingler' : 'Epingler'}
          >
            <Pin className={`w-4 h-4 ${pinned ? 'fill-[#E07862]' : ''}`} />
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#2C2C2C] hover:bg-[#FAF8F5] border border-transparent transition-colors disabled:opacity-50"
            title="Exporter en PDF"
          >
            <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
          </button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metadata bar: folder + tags */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {note.folder && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF5EB] text-[#D4924C] rounded-lg text-xs">
            <FolderOpen className="w-3 h-3" />
            {note.folder}
          </span>
        )}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((tag) => {
            const color = getTagColor(tag)
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${color.bg} ${color.text}`}
              >
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="opacity-60 hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
          <div className="inline-flex items-center gap-1 text-[#9CA3AF]">
            <Tag className="w-3 h-3" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => { if (tagInput.trim()) handleAddTag() }}
              placeholder="Ajouter un tag..."
              className="bg-transparent text-xs w-24 focus:w-36 transition-all focus:outline-none placeholder-[#B5B0A8] text-[#717171]"
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Sans titre"
        className="w-full bg-transparent text-3xl font-bold text-[#2C2C2C] placeholder-[#D4CFC8] focus:outline-none mb-2 border-none tracking-tight"
      />

      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#E8E3DE] -mx-8 px-8 py-2 mb-4">
        <div className="flex items-center gap-0.5 flex-wrap">
          {toolbarItems.map((entry, i) => {
            if ('type' in entry && entry.type === 'separator') {
              return <div key={i} className="w-px h-5 bg-[#E8E3DE] mx-1.5" />
            }
            const item = entry as ToolbarItem
            const Icon = item.icon
            return (
              <button
                key={i}
                onClick={() => handleToolbarAction(item)}
                title={item.label}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2C2C2C] hover:bg-[#F0ECE6] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}

          <div className="flex-1" />

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-[#F0ECE6] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('write')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'write' ? 'bg-white text-[#E07862] shadow-warm-sm' : 'text-[#9CA3AF] hover:text-[#717171]'
              }`}
            >
              Ecrire
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-white text-[#E07862] shadow-warm-sm' : 'text-[#9CA3AF] hover:text-[#717171]'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'preview' ? 'bg-white text-[#E07862] shadow-warm-sm' : 'text-[#9CA3AF] hover:text-[#717171]'
              }`}
            >
              Apercu
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className={viewMode === 'split' ? 'grid grid-cols-2 gap-4' : ''}>
        {(viewMode === 'write' || viewMode === 'split') && (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Commencez a ecrire..."
            className="w-full bg-white border border-[#E8E3DE] rounded-2xl p-6 text-[#2C2C2C] placeholder-[#D4CFC8] focus:outline-none focus:border-[#E07862]/40 resize-none min-h-[500px] text-[15px] leading-[1.8] font-sans selection:bg-[#E07862]/20 overflow-hidden shadow-warm-sm"
          />
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="prose max-w-none bg-white border border-[#E8E3DE] rounded-2xl p-6 min-h-[500px] text-[15px] leading-[1.8] prose-headings:text-[#2C2C2C] prose-headings:font-semibold prose-p:text-[#555555] prose-a:text-[#E07862] prose-strong:text-[#2C2C2C] prose-code:text-[#E07862] prose-code:bg-[#FDF0ED] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-[#E07862]/30 prose-blockquote:text-[#717171] overflow-y-auto shadow-warm-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*Aucun contenu*'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Supprimer la note">
        <p className="text-[#717171] text-sm mb-4">Cette action est irreversible. Voulez-vous vraiment supprimer cette note ?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  )
}
