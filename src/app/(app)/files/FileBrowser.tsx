'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { uploadFile, deleteFile, getSignedUrl, createFolder } from './actions'
import {
  Upload,
  Trash2,
  Download,
  FolderOpen,
  File,
  FolderPlus,
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
  if (bytes === 0) return '—'
  const units = ['o', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`
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
  const [folderModal, setFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const onDrop = useCallback(
    async (acceptedFiles: globalThis.File[]) => {
      setUploading(true)
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', currentFolder)
        await uploadFile(formData)
      }
      setUploading(false)
      router.refresh()
    },
    [currentFolder, router]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  })

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

  // Breadcrumbs
  const breadcrumbs = currentFolder ? currentFolder.split('/') : []

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push('/files')}
            className="text-white/50 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-white/30" />
              <button
                onClick={() => {
                  const path = breadcrumbs.slice(0, i + 1).join('/')
                  router.push(`/files?folder=${encodeURIComponent(path)}`)
                }}
                className={`${
                  i === breadcrumbs.length - 1
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
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
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 font-medium transition-colors px-4 py-2 text-sm rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white">
            <Upload className="w-4 h-4" />
            Upload
            <input
              type="file"
              multiple
              className="hidden"
              onChange={async (e) => {
                if (e.target.files) {
                  await onDrop(Array.from(e.target.files))
                }
              }}
            />
          </label>
        </div>
      </div>

      {isDragActive && (
        <div className="fixed inset-0 z-40 bg-indigo-500/10 border-2 border-dashed border-indigo-500/50 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <p className="text-white text-lg">Déposez vos fichiers ici</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-sm">
          Upload en cours...
        </div>
      )}

      {initialFiles.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-4">Ce dossier est vide</p>
          <p className="text-white/30 text-sm">Glissez-déposez des fichiers ou cliquez sur Upload</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Nom</th>
                <th className="text-left px-5 py-3 font-medium">Taille</th>
                <th className="text-left px-5 py-3 font-medium">Modifié</th>
                <th className="px-5 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {initialFiles.map((file) => {
                const isFolder = file.mime_type === 'application/x-directory'
                return (
                  <tr
                    key={file.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-5 py-3">
                      {isFolder ? (
                        <button
                          onClick={() => navigateToFolder(file.name)}
                          className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors"
                        >
                          <FolderOpen className="w-5 h-5 text-indigo-400" />
                          <span className="text-sm">{file.name}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-white/40" />
                          <span className="text-sm text-white">{file.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-white/40 text-sm">
                      {formatSize(file.size)}
                    </td>
                    <td className="px-5 py-3 text-white/40 text-sm">
                      {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: fr })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isFolder && (
                          <button
                            onClick={() => handleDownload(file.storage_path, file.name)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(file.id, file.storage_path, isFolder)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
