import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'
import { Spot } from '@/types'
import { ArrowRight, MapPin, Zap, Anchor } from 'lucide-react'
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
  alternates: { canonical: '/' },
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
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative h-[90vh] min-h-[560px] flex items-end overflow-hidden">
        {/* Achtergrond foto */}
        <img
          src="https://images.unsplash.com/photo-1609096486073-e57a1e7e76a0?auto=format&fit=crop&w=1920&q=80"
          alt="Wakeboarden in Nederland"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Content */}
        <div className="relative w-full max-w-6xl mx-auto px-4 pb-16 sm:pb-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-5">
              <span className="w-8 h-px bg-cyan-400" />
              {totalSpots ?? 0} locaties · heel Nederland
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6 tracking-tight">
              Vind jouw<br />
              <span className="text-cyan-400">wakeboard</span><br />
              spot.
            </h1>
            <p className="text-base sm:text-lg text-white/70 mb-10 max-w-lg leading-relaxed">
              De complete gids voor kabelbanen, bootrijden en waterski locaties in Nederland — bij jou in de buurt.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/spots"
                className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-7 py-3.5 rounded-full transition-colors text-sm shadow-xl"
              >
                Bekijk alle spots
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/spots?type=kabel"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-7 py-3.5 rounded-full transition-colors border border-white/20 text-sm"
              >
                Kabelbanen
              </Link>
              <Link
                href="/spots?type=boot"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-7 py-3.5 rounded-full transition-colors border border-white/20 text-sm"
              >
                Bootrijden
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: totalSpots ?? 0, label: 'Wakeboardspots' },
              { value: '12', label: 'Provincies' },
              { value: '100%', label: 'Gratis toegang' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 sm:px-10 py-7 text-center">
                <div className="text-3xl sm:text-4xl font-black text-cyan-400">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/50 mt-1 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIEËN ── */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Waar wil jij rijden?</h2>
          <p className="text-slate-500 mt-2">Kies jouw type spot</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: '/spots?type=kabel',
              icon: Zap,
              title: 'Kabelbaan',
              sub: 'Rijden zonder boot',
              bg: 'from-blue-500 to-cyan-500',
            },
            {
              href: '/spots?type=boot',
              icon: Anchor,
              title: 'Bootrijden',
              sub: 'Achter een speedboat',
              bg: 'from-cyan-500 to-teal-500',
            },
            {
              href: '/spots?type=beide',
              icon: MapPin,
              title: 'Kabel & Boot',
              sub: 'Het beste van beide',
              bg: 'from-teal-500 to-emerald-500',
            },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.bg} p-8 text-white hover:scale-[1.02] transition-transform duration-200 shadow-lg`}
            >
              <cat.icon className="w-10 h-10 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-1">{cat.title}</h3>
              <p className="text-white/70 text-sm">{cat.sub}</p>
              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── NIEUWSTE SPOTS ── */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Nieuwste spots</h2>
              <p className="text-slate-500 mt-2">Recent toegevoegd aan de directory</p>
            </div>
            <Link
              href="/spots"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-cyan-600 transition-colors"
            >
              Alle {totalSpots} spots
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#06b6d4,transparent_60%),radial-gradient(circle_at_70%_50%,#3b82f6,transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5">
            Ken jij een spot<br />die er nog niet op staat?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Help de community groeien en voeg een wakeboardlocatie toe.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-8 py-4 rounded-full transition-colors text-sm shadow-xl"
          >
            Spot toevoegen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
