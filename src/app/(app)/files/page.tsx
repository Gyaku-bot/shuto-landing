import { getFiles } from './actions'
import FileBrowser from './FileBrowser'

export const dynamic = 'force-dynamic'

export default async function FilesPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>
}) {
  const { folder = '' } = await searchParams
  const files = await getFiles(folder)
  return <FileBrowser initialFiles={files} currentFolder={folder} />
}
