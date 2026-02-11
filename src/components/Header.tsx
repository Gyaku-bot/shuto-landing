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
    <header className="h-16 border-b border-[#E8E3DE] bg-white/80 backdrop-blur-sm flex items-center px-8 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-[#2C2C2C]">{title}</h2>
    </header>
  )
}
