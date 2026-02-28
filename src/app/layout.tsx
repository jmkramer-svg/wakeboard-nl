import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
        <Footer />
      </body>
    </html>
  )
}
