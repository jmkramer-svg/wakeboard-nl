import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'
import { Spot } from '@/types'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wakeboard NL — Vind jouw wakeboardspot in Nederland',
  description: 'Vind kabelbanen, bootrijden en waterski locaties in Nederland. De complete gids voor alle wakeboardspots per provincie.',
  openGraph: { title: 'Wakeboard NL — Vind jouw wakeboardspot in Nederland', description: 'De complete gids voor alle wakeboardspots in Nederland.', type: 'website' },
  alternates: { canonical: '/' },
}

const PROVINCE_PHOTOS: Record<string, string> = {
  'Noord-Holland':  'https://images.unsplash.com/photo-1584001645107-9e10dee34873?w=600&auto=format&fit=crop&q=70',
  'Zuid-Holland':   'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&auto=format&fit=crop&q=70',
  'Noord-Brabant':  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=70',
  'Gelderland':     'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=70',
  'Utrecht':        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=70',
  'Limburg':        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=70',
  'Overijssel':     'https://images.unsplash.com/photo-1531722569936-825d4eea6ae3?w=600&auto=format&fit=crop&q=70',
  'Flevoland':      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=70',
  'Friesland':      'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&auto=format&fit=crop&q=70',
  'Groningen':      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&auto=format&fit=crop&q=70',
  'Drenthe':        'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=70',
  'Zeeland':        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=70',
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: spots }, { data: provinceCounts }] = await Promise.all([
    supabase.from('spots').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
    supabase.from('spots').select('province').eq('is_published', true),
  ])

  const featuredSpots: Spot[] = spots ?? []

  // Tel spots per provincie
  const counts: Record<string, number> = {}
  for (const s of (provinceCounts ?? [])) {
    counts[s.province] = (counts[s.province] ?? 0) + 1
  }
  const totalSpots = provinceCounts?.length ?? 0

  const provinces = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative h-[88vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1609096486073-e57a1e7e76a0?auto=format&fit=crop&w=1920&q=80"
          alt="Wakeboarden in Nederland"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

        <div className="relative max-w-6xl mx-auto px-5 w-full">
          <div className="max-w-xl">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-cyan-400 inline-block" />
              {totalSpots} locaties in heel Nederland
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.9] tracking-tight mb-7">
              Jouw<br />
              perfecte<br />
              <span className="text-cyan-400">wakeboard</span><br />
              spot.
            </h1>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
              Ontdek kabelbanen, waterski en bootrijden bij jou in de buurt — overal in Nederland.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/spots" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-7 py-3.5 rounded-full hover:bg-cyan-50 transition-colors text-sm shadow-xl">
                Alle spots bekijken
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/spots?type=kabel" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm backdrop-blur">
                Kabelbanen
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-white/20" />
        </div>
      </section>

      {/* ── BROWSE PER PROVINCIE ── */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-cyan-600 text-xs font-semibold uppercase tracking-widest mb-2">Ontdekken per regio</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Waar wil jij rijden?</h2>
            </div>
            <Link href="/spots" className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Alle provincies <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {provinces.map(([province, count]) => (
              <Link
                key={province}
                href={`/spots?province=${province}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={PROVINCE_PHOTOS[province] ?? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=70'}
                  alt={province}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm leading-tight">{province}</h3>
                  <p className="text-white/60 text-xs mt-0.5">{count} {count === 1 ? 'spot' : 'spots'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UITGELICHTE SPOTS ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-cyan-600 text-xs font-semibold uppercase tracking-widest mb-2">Vers toegevoegd</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Nieuwste spots</h2>
            </div>
            <Link href="/spots" className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Alle {totalSpots} spots <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TYPES SECTIE ── */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-12">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">Wat past bij jou?</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Kies jouw stijl</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { href: '/spots?type=kabel', label: 'Kabelbaan', desc: 'Rondjes rijden zonder boot. Ideaal om te leren of bij te slijpen.', emoji: '⚡' },
              { href: '/spots?type=boot', label: 'Achter de boot', desc: 'Klassiek wakeboarden achter een speedboot op open water.', emoji: '🚤' },
              { href: '/spots?type=beide', label: 'Kabel & Boot', desc: 'Het complete plaatje — zowel kabelbaan als bootrijden op één locatie.', emoji: '🏆' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 rounded-2xl p-7 transition-all duration-200"
              >
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.label}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-semibold group-hover:gap-2 transition-all">
                  Bekijk spots <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
