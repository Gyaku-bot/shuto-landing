'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CollapsibleSection({
  title,
  icon,
  count,
  defaultOpen = true,
  action,
  children,
}: {
  title: string
  icon: React.ReactNode
  count?: number
  defaultOpen?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="bg-white border border-[#E8E3DE] rounded-2xl overflow-hidden shadow-warm-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#FAF8F5] transition-colors"
      >
        {icon}
        <h3 className="text-[#2C2C2C] font-semibold text-sm flex-1 text-left">{title}</h3>
        {count !== undefined && (
          <span className="text-[#B5B0A8] text-xs">{count}</span>
        )}
        {action && (
          <span onClick={(e) => e.stopPropagation()}>
            {action}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-[#B5B0A8] transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#F0ECE6]">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
