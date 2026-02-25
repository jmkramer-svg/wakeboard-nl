import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'
import SpotFilters from '@/components/SpotFilters'
import SpotMapWrapper from '@/components/SpotMapWrapper'
import { Spot } from '@/types'
import { Waves, Map, LayoutGrid } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alle wakeboardspots in Nederland',
  description:
    'Overzicht van alle kabelbanen, waterski- en wakeboardlocaties in Nederland. Filter op provincie, type en niveau en vind de spot bij jou in de buurt.',
  openGraph: {
    title: 'Alle wakeboardspots in Nederland — Wakeboard NL',
    description:
      'Overzicht van alle kabelbanen, waterski- en wakeboardlocaties in Nederland. Filter op provincie, type en niveau.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alle wakeboardspots in Nederland — Wakeboard NL',
    description: 'Kabelbanen, waterski en wakeboardlocaties per provincie.',
  },
  alternates: { canonical: '/spots' },
}

interface SpotsPageProps {
  searchParams: Promise<{
    province?: string
    type?: string
    difficulty?: string
    search?: string
    view?: string
  }>
}

export default async function SpotsPage({ searchParams }: SpotsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('spots').select('*').eq('is_published', true).order('name')
  if (params.province)   query = query.eq('province', params.province)
  if (params.type)       query = query.eq('type', params.type)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.search)     query = query.or(`name.ilike.%${params.search}%,city.ilike.%${params.search}%`)

  const { data } = await query
  const spots: Spot[] = data ?? []
  const showMap = params.view === 'map'

  const cleanParams: Record<string, string> = {}
  if (params.province)   cleanParams.province   = params.province
  if (params.type)       cleanParams.type       = params.type
  if (params.difficulty) cleanParams.difficulty = params.difficulty
  if (params.search)     cleanParams.search     = params.search

  const listHref = Object.keys(cleanParams).length > 0
    ? `/spots?${new URLSearchParams(cleanParams)}`
    : '/spots'
  const mapHref = `/spots?${new URLSearchParams({ ...cleanParams, view: 'map' })}`

  const kabelCount = spots.filter(s => s.type === 'kabel' || s.type === 'beide').length
  const bootCount  = spots.filter(s => s.type === 'boot'  || s.type === 'beide').length
  const provCount  = new Set(spots.map(s => s.province)).size

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Deep water gradient */}
        <div className="absolute inset-0 bg-[#050e1a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071d31] via-[#050e1a] to-[#030b15]" />

        {/* Glow blobs */}
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-sky-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-indigo-600/8 rounded-full blur-[80px]" />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Thin top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">

            {/* Title */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-[0.18em]">
                  {spots.length} actieve locaties in Nederland
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-black text-white tracking-tight leading-[0.92]">
                {params.province ? (
                  <>
                    Spots in<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
                      {params.province}
                    </span>
                  </>
                ) : (
                  <>
                    Alle<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
                      Wakeboard
                    </span>
                    <br />
                    <span className="text-white">spots.</span>
                  </>
                )}
              </h1>

              <p className="text-white/35 mt-5 text-base sm:text-lg leading-relaxed">
                Van professionele kabelbanen tot idyllisch bootrijden —<br className="hidden sm:block" />
                vind jouw perfecte spot.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              {[
                { value: kabelCount, label: 'Kabelbanen',  color: 'from-blue-500/20 to-blue-600/10',   border: 'border-blue-500/20',   text: 'text-blue-300' },
                { value: bootCount,  label: 'Bootrijden',  color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-300' },
                { value: provCount,  label: 'Provincies',  color: 'from-cyan-500/20 to-cyan-600/10',    border: 'border-cyan-500/20',    text: 'text-cyan-300' },
              ].map(({ value, label, color, border, text }) => (
                <div
                  key={label}
                  className={`bg-gradient-to-br ${color} backdrop-blur border ${border} rounded-2xl px-5 sm:px-6 py-4 sm:py-5 text-center min-w-[90px] flex-1 sm:flex-none`}
                >
                  <div className="text-3xl sm:text-4xl font-black text-white">{value}</div>
                  <div className={`text-[11px] font-semibold uppercase tracking-wider mt-1.5 ${text}`}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── STICKY FILTER BAR ── */}
      <div className="sticky top-16 z-40 bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="flex items-center gap-3">
            {/* Scrollable filters */}
            <div className="flex items-center gap-2 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Suspense>
                <SpotFilters />
              </Suspense>
            </div>

            {/* View toggle */}
            <div className="flex-shrink-0 flex gap-1 bg-slate-100 rounded-xl p-1">
              <a
                href={listHref}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  !showMap
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Lijst</span>
              </a>
              <a
                href={mapHref}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  showMap
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Kaart</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── SPOT GRID / MAP ── */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">

          {spots.length === 0 && (
            <div className="text-center py-28">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                <Waves className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-800 font-bold text-xl mb-1">Geen spots gevonden</p>
              <p className="text-slate-400 text-sm">Probeer je filters aan te passen</p>
            </div>
          )}

          {showMap && spots.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md">
              <SpotMapWrapper spots={spots} height="600px" />
            </div>
          )}

          {!showMap && spots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {spots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
