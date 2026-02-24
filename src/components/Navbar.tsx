'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/spots', label: 'Spots' },
    { href: '/articles', label: 'Artikelen' },
  ]

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span className="text-2xl">🏄</span>
          <span>Wakeboard NL</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
