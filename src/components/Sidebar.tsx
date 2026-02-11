'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, FileText, FolderOpen, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/files', label: 'Fichiers', icon: FolderOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-[#E8E3DE] flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#2C2C2C] tracking-wide">Shuto</h1>
        <p className="text-xs text-[#9CA3AF] mt-0.5">Espace personnel</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#FDF0ED] text-[#E07862] border border-[#F5D5CD]'
                  : 'text-[#717171] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#E8E3DE]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#717171] hover:text-[#2C2C2C] hover:bg-[#FAF8F5] transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Deconnexion
        </button>
      </div>
    </aside>
  )
}
