import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Wakeboard NL — Vind jouw spot',
  description:
    'De grootste directory van wakeboardlocaties in Nederland. Vind kabelbanen, bootrijden en meer bij jou in de buurt.',
  openGraph: {
    title: 'Wakeboard NL',
    description: 'Vind wakeboardspots in Nederland',
    locale: 'nl_NL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
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
