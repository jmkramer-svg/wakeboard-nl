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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm">
            <p>
              © {new Date().getFullYear()} Wakeboard NL — Alle wakeboardspots
              op één plek
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
