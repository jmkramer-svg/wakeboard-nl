'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="WakeboardNL" className="h-10 w-auto" />
          <span className="font-black text-lg tracking-tight text-slate-900">Wakeboard<span className="text-cyan-500">NL</span></span>
        </Link>

        <Link
          href="/spots"
          className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-5 py-2 rounded-full text-sm transition-colors"
        >
          Vind een spot
        </Link>
      </div>
    </nav>
  )
}
