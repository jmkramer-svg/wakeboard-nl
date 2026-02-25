import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Wakeboard NL — Vind jouw spot',
    template: '%s — Wakeboard NL',
  },
  description:
    'De grootste directory van wakeboardlocaties in Nederland. Vind kabelbanen, bootrijden en meer bij jou in de buurt.',
  openGraph: {
    title: 'Wakeboard NL — Vind jouw spot',
    description: 'De grootste directory van wakeboardlocaties in Nederland. Vind kabelbanen, bootrijden en meer bij jou in de buurt.',
    locale: 'nl_NL',
    type: 'website',
    url: siteUrl,
    siteName: 'Wakeboard NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wakeboard NL — Vind jouw spot',
    description: 'De grootste directory van wakeboardlocaties in Nederland.',
  },
  alternates: {
    canonical: siteUrl,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Wakeboard NL',
  url: siteUrl,
  description: 'De grootste directory van wakeboardlocaties in Nederland.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-950 text-slate-400 pt-14 pb-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
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
            </div>
            <div className="pt-6 text-center text-xs text-slate-600">
              © {new Date().getFullYear()} Wakeboard NL — Alle wakeboardspots op één plek
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
