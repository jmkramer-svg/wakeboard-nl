'use client'

import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div>
            <div className="font-black text-white text-lg mb-3">🏄 Wakeboard<span className="text-cyan-400">NL</span></div>
            <p className="text-sm text-slate-500 leading-relaxed">De complete gids voor wakeboardlocaties in Nederland.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Ontdekken</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/spots" className="hover:text-white transition-colors">Alle spots</a></li>
              <li><a href="/spots?type=kabel" className="hover:text-white transition-colors">Kabelbanen</a></li>
              <li><a href="/spots?type=boot" className="hover:text-white transition-colors">Bootrijden</a></li>
              <li><a href="/articles" className="hover:text-white transition-colors">Artikelen</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Provincies</h4>
            <ul className="space-y-2 text-sm">
              {['Noord-Holland', 'Zuid-Holland', 'Noord-Brabant', 'Gelderland', 'Utrecht'].map(p => (
                <li key={p}><a href={`/spots?province=${p}`} className="hover:text-white transition-colors">{p}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Juridisch</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacybeleid</a></li>
              <li><a href="/voorwaarden" className="hover:text-white transition-colors">Voorwaarden</a></li>
              <li><a href="/cookies" className="hover:text-white transition-colors">Cookiebeleid</a></li>
              <li><a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Wakeboard NL — Alle wakeboardspots op één plek
        </div>
      </div>
    </footer>
  )
}
