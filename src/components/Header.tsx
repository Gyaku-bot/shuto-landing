'use client'

import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/notes': 'Notes',
  '/files': 'Fichiers',
}

export default function Header() {
  const pathname = usePathname()

  const title = Object.entries(titles).find(([path]) =>
    pathname === path || pathname.startsWith(path + '/')
  )?.[1] ?? ''

  return (
    <header className="h-16 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </header>
  )
}
