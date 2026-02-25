import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'
import { Spot } from '@/types'
import { Waves, MapPin, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wakeboard NL — Vind jouw wakeboardspot in Nederland',
  description:
    'Vind kabelbanen, bootrijden en waterski locaties in Nederland. De complete gids voor alle wakeboardspots per provincie.',
  openGraph: {
    title: 'Wakeboard NL — Vind jouw wakeboardspot in Nederland',
    description:
      'Vind kabelbanen, bootrijden en waterski locaties in Nederland. De complete gids voor alle wakeboardspots per provincie.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wakeboard NL — Vind jouw wakeboardspot in Nederland',
    description: 'De complete gids voor alle wakeboardspots in Nederland.',
  },
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: spots } = await supabase
    .from('spots')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const featuredSpots: Spot[] = spots ?? []

  const { count: totalSpots } = await supabase
    .from('spots')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTZzLTItNC0yLTYtMi00LTItNiAyLTQgMi02Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Waves className="w-4 h-4" />
            {totalSpots ?? 0} spots in Nederland
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Vind jouw wakeboard spot
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            De complete gids voor wakeboardlocaties in Nederland. Kabelbanen,
            bootrijden en alles daartussenin — bij jou in de buurt.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/spots"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              Bekijk alle spots
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/spots?type=kabel"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors border border-white/30"
            >
              Kabelbanen
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            {[
              { label: 'Wakeboardspots', value: totalSpots ?? 0 },
              { label: 'Provincies', value: '12' },
              { label: 'Gratis toegang', value: '100%' },
            ].map((stat) => (
              <div key={stat.label} className="px-8 py-2">
                <div className="text-3xl font-extrabold text-blue-600">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent spots */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Nieuwste spots</h2>
            <p className="text-slate-500 mt-1">Recent toegevoegd aan de directory</p>
          </div>
          <Link
            href="/spots"
            className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700 text-sm"
          >
            Alle spots
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredSpots.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Waves className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nog geen spots toegevoegd</p>
            <p className="text-slate-400 text-sm mt-1">Ga naar het admin dashboard om spots toe te voegen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <MapPin className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Weet jij een spot die er nog niet opstaat?</h2>
          <p className="text-slate-400 mb-8">
            Help de community door wakeboardlocaties toe te voegen via het admin dashboard.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Admin dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
