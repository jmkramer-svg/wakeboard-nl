'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/spots', label: 'Spots' },
    { href: '/articles', label: 'Artikelen' },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-slate-900 hover:text-cyan-600 transition-colors" onClick={() => setOpen(false)}>
          <span className="text-xl">🏄</span>
          <span>Wakeboard<span className="text-cyan-500">NL</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-cyan-600 bg-cyan-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/spots"
            className="ml-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-5 py-2 rounded-full text-sm transition-colors"
          >
            Vind een spot
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                pathname === link.href
                  ? 'text-cyan-600 bg-cyan-50'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/spots"
            onClick={() => setOpen(false)}
            className="mt-1 bg-cyan-400 text-black font-bold px-4 py-3 rounded-xl text-sm text-center"
          >
            Vind een spot
          </Link>
        </div>
      )}
    </nav>
  )
}
