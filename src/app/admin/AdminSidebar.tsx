'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { adminNavItems } from './nav-config'
import AdminLogout from './AdminLogout'

interface AdminSidebarProps {
  userEmail: string
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-slate-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-white text-sm">
          <span className="text-xl">🏄</span>
          <span>Wakeboard NL</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800 space-y-2">
        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
        <AdminLogout />
      </div>
    </aside>
  )
}
