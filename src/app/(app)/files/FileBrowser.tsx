'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { uploadFile, deleteFile, getSignedUrl, createFolder, ensureFolderExists } from './actions'
import {
  Upload,
  Trash2,
  Download,
  FolderOpen,
  File,
  FolderPlus,
  FolderUp,
  ChevronRight,
  Home,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

interface FileRecord {
  id: string
  name: string
  storage_path: string
  size: number
  mime_type: string
  folder: string
  created_at: string
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '\u2014'
  const units = ['o', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`
}

// --- Directory reading helpers ---

function getFileFromEntry(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject))
}

async function readAllEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  const all: FileSystemEntry[] = []
  let batch: FileSystemEntry[]
  do {
    batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject))
    all.push(...batch)
  } while (batch.length > 0)
  return all
}

async function collectFiles(
  entry: FileSystemEntry,
  basePath: string = '',
): Promise<{ file: File; relativePath: string }[]> {
  if (entry.isFile) {
    const file = await getFileFromEntry(entry as FileSystemFileEntry)
    return [{ file, relativePath: basePath ? `${basePath}/${entry.name}` : entry.name }]
  }

  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    const entries = await readAllEntries(reader)
    const currentPath = basePath ? `${basePath}/${entry.name}` : entry.name
    const results: { file: File; relativePath: string }[] = []

    for (const child of entries) {
      const childFiles = await collectFiles(child, currentPath)
      results.push(...childFiles)
    }
    return results
  }

  return []
}

export default function FileBrowser({
  initialFiles,
  currentFolder,
}: {
  initialFiles: FileRecord[]
  currentFolder: string
}) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [folderModal, setFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const dragCounter = useRef(0)

  // Upload flat files (no folder structure)
  const uploadFiles = useCallback(
    async (files: File[]) => {
      setUploading(true)
      setUploadProgress(`0/${files.length} fichiers`)
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`${i + 1}/${files.length} fichiers`)
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('folder', currentFolder)
        await uploadFile(formData)
      }
      setUploading(false)
      setUploadProgress('')
      router.refresh()
    },
    [currentFolder, router],
  )

  // Upload files preserving their folder structure
  async function uploadWithStructure(filesWithPaths: { file: File; relativePath: string }[]) {
    setUploading(true)

    // Extract all unique folder paths that need to be created
    const folderPaths = new Set<string>()
    for (const { relativePath } of filesWithPaths) {
      const parts = relativePath.split('/')
      // All parts except the last one (filename) are folders
      for (let i = 1; i < parts.length; i++) {
        folderPaths.add(parts.slice(0, i).join('/'))
      }
    }

    // Sort so parents come before children
    const sortedFolders = Array.from(folderPaths).sort()

    // Create folders
    setUploadProgress(`Creation des dossiers...`)
    for (const folderPath of sortedFolders) {
      const parts = folderPath.split('/')
      const name = parts[parts.length - 1]
      const parentParts = parts.slice(0, -1)
      const parentFolder = currentFolder
        ? parentParts.length > 0
          ? `${currentFolder}/${parentParts.join('/')}`
          : currentFolder
        : parentParts.join('/')
      await ensureFolderExists(name, parentFolder)
    }

    // Upload files
    const total = filesWithPaths.length
    for (let i = 0; i < total; i++) {
      const { file, relativePath } = filesWithPaths[i]
      setUploadProgress(`${i + 1}/${total} fichiers`)
      const parts = relativePath.split('/')
      const folderPart = parts.slice(0, -1).join('/')
      const targetFolder = currentFolder
        ? folderPart
          ? `${currentFolder}/${folderPart}`
          : currentFolder
        : folderPart

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', targetFolder)
      await uploadFile(formData)
    }

    setUploading(false)
    setUploadProgress('')
    router.refresh()
  }

  // --- Drag and drop handlers ---

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true)
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragActive(false)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  async function handleNativeDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    dragCounter.current = 0

    const items = e.dataTransfer.items
    if (!items || items.length === 0) return

    // Check for directory entries
    const entries: FileSystemEntry[] = []
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry?.()
      if (entry) entries.push(entry)
    }

    const hasDirectories = entries.some((e) => e.isDirectory)

    if (hasDirectories) {
      // Collect all files with their relative paths
      const allFiles: { file: File; relativePath: string }[] = []
      for (const entry of entries) {
        if (entry.isDirectory) {
          const files = await collectFiles(entry)
          allFiles.push(...files)
        } else {
          const file = await getFileFromEntry(entry as FileSystemFileEntry)
          allFiles.push({ file, relativePath: file.name })
        }
      }
      if (allFiles.length > 0) {
        await uploadWithStructure(allFiles)
      }
    } else {
      // Regular file drop
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        await uploadFiles(files)
      }
    }
  }

  // --- Folder upload via input (webkitdirectory) ---

  async function handleFolderInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const filesWithPaths: { file: File; relativePath: string }[] = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name
      filesWithPaths.push({ file, relativePath })
    }

    await uploadWithStructure(filesWithPaths)
    // Reset input
    e.target.value = ''
  }

  // --- Other handlers ---

  async function handleDownload(storagePath: string, fileName: string) {
    const url = await getSignedUrl(storagePath)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }

  async function handleDelete(id: string, storagePath: string, isFolder: boolean) {
    await deleteFile(id, storagePath, isFolder)
    router.refresh()
  }

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return
    await createFolder(newFolderName.trim(), currentFolder)
    setNewFolderName('')
    setFolderModal(false)
    router.refresh()
  }

  function navigateToFolder(folderName: string) {
    const path = currentFolder ? `${currentFolder}/${folderName}` : folderName
    router.push(`/files?folder=${encodeURIComponent(path)}`)
  }

  const breadcrumbs = currentFolder ? currentFolder.split('/') : []

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleNativeDrop}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push('/files')}
            className="text-[#717171] hover:text-[#2C2C2C] transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-[#B5B0A8]" />
              <button
                onClick={() => {
                  const path = breadcrumbs.slice(0, i + 1).join('/')
                  router.push(`/files?folder=${encodeURIComponent(path)}`)
                }}
                className={`${
                  i === breadcrumbs.length - 1
                    ? 'text-[#2C2C2C]'
                    : 'text-[#717171] hover:text-[#2C2C2C]'
                } transition-colors`}
              >
                {crumb}
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setFolderModal(true)}>
            <FolderPlus className="w-4 h-4" />
            Dossier
          </Button>
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 font-medium transition-colors px-4 py-2 text-sm rounded-xl bg-white hover:bg-[#FAF8F5] text-[#2C2C2C] border border-[#E8E3DE]">
            <FolderUp className="w-4 h-4" />
            Upload dossier
            <input
              type="file"
              /* @ts-expect-error webkitdirectory is non-standard */
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
              onChange={handleFolderInputChange}
            />
          </label>
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 font-medium transition-colors px-4 py-2 text-sm rounded-xl bg-[#E07862] hover:bg-[#D4624C] text-white shadow-warm-sm">
            <Upload className="w-4 h-4" />
            Upload
            <input
              type="file"
              multiple
              className="hidden"
              onChange={async (e) => {
                if (e.target.files) {
                  await uploadFiles(Array.from(e.target.files))
                }
              }}
            />
          </label>
        </div>
      </div>

      {isDragActive && (
        <div className="fixed inset-0 z-40 bg-[#E07862]/5 border-2 border-dashed border-[#E07862]/40 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Upload className="w-12 h-12 text-[#E07862] mx-auto mb-3" />
            <p className="text-[#2C2C2C] text-lg">Deposez vos fichiers ou dossiers ici</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mb-4 p-3 bg-[#FDF0ED] border border-[#F5D5CD] rounded-xl text-[#E07862] text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#E07862] border-t-transparent rounded-full animate-spin" />
          Upload en cours... {uploadProgress}
        </div>
      )}

      {initialFiles.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-[#D4CFC8] mx-auto mb-4" />
          <p className="text-[#717171] mb-4">Ce dossier est vide</p>
          <p className="text-[#9CA3AF] text-sm">Glissez-deposez des fichiers ou dossiers, ou cliquez sur Upload</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E3DE] rounded-2xl overflow-hidden shadow-warm-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E3DE] text-[#9CA3AF] text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Nom</th>
                <th className="text-left px-5 py-3 font-medium">Taille</th>
                <th className="text-left px-5 py-3 font-medium">Modifie</th>
                <th className="px-5 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {initialFiles.map((file) => {
                const isFolder = file.mime_type === 'application/x-directory'
                return (
                  <tr
                    key={file.id}
                    className="border-b border-[#F0ECE6] hover:bg-[#FAF8F5] transition-colors group"
                  >
                    <td className="px-5 py-3">
                      {isFolder ? (
                        <button
                          onClick={() => navigateToFolder(file.name)}
                          className="flex items-center gap-3 text-[#2C2C2C] hover:text-[#E07862] transition-colors"
                        >
                          <FolderOpen className="w-5 h-5 text-[#D4924C]" />
                          <span className="text-sm">{file.name}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-[#9CA3AF]" />
                          <span className="text-sm text-[#2C2C2C]">{file.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[#9CA3AF] text-sm">
                      {formatSize(file.size)}
                    </td>
                    <td className="px-5 py-3 text-[#9CA3AF] text-sm">
                      {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: fr })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isFolder && (
                          <button
                            onClick={() => handleDownload(file.storage_path, file.name)}
                            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#2C2C2C] hover:bg-[#F0ECE6] transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(file.id, file.storage_path, isFolder)}
                          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#DC6B6B] hover:bg-[#FDF0F0] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={folderModal} onClose={() => setFolderModal(false)} title="Nouveau dossier">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreateFolder()
          }}
        >
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
