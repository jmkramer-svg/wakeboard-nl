import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Trick, TrickCategory, TrickTypeOption } from '@/types'
import { ArrowLeft, Star, Cable, Ship, Layers } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trickgids — Alle Wakeboard Tricks | Wakeboard NL',
  description: 'Ontdek alle wakeboard tricks van beginner tot expert. Filter op categorie, moeilijkheidsgraad en type. De complete Nederlandse trick-encyclopedie.',
  openGraph: {
    title: 'Trickgids — Alle Wakeboard Tricks',
    description: 'Ontdek alle wakeboard tricks van beginner tot expert.',
    type: 'website',
  },
  alternates: { canonical: '/trickgids' },
}

const CATEGORY_LABELS: Record<TrickCategory, string> = {
  surface: 'Surface',
  ollie: 'Ollie',
  invert: 'Invert',
  grab: 'Grab',
  rail: 'Rail',
  switch: 'Switch',
}

const CATEGORY_COLORS: Record<TrickCategory, string> = {
  surface: 'bg-blue-100 text-blue-700',
  ollie: 'bg-green-100 text-green-700',
  invert: 'bg-purple-100 text-purple-700',
  grab: 'bg-amber-100 text-amber-700',
  rail: 'bg-red-100 text-red-700',
  switch: 'bg-cyan-100 text-cyan-700',
}

const DIFFICULTY_LABELS = ['Beginner', 'Makkelijk', 'Gemiddeld', 'Moeilijk', 'Expert']

const TYPE_ICONS: Record<TrickTypeOption, React.ReactNode> = {
  cable: <Cable className="w-3.5 h-3.5" />,
  boot: <Ship className="w-3.5 h-3.5" />,
  both: <Layers className="w-3.5 h-3.5" />,
}

const TYPE_LABELS: Record<TrickTypeOption, string> = {
  cable: 'Kabel',
  boot: 'Boot',
  both: 'Beide',
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    difficulty?: string
    type?: string
  }>
}

export default async function TrickgidsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('tricks')
    .select('*')
    .eq('is_published', true)
    .order('difficulty_level', { ascending: true })
    .order('title', { ascending: true })

  if (params.category) {
    query = query.eq('category', params.category)
  }
  if (params.difficulty) {
    query = query.eq('difficulty_level', Number(params.difficulty))
  }
  if (params.type && params.type !== 'both') {
    query = query.or(`trick_type.eq.${params.type},trick_type.eq.both`)
  }

  const { data } = await query
  const tricks: Trick[] = data ?? []

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#050e1a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071d31] via-[#050e1a] to-[#030b15]" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-sky-500/8 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-[0.18em]">
              Trickgids
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.92]">
            Alle Wakeboard{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
              Tricks
            </span>
          </h1>
          <p className="text-white/35 mt-5 text-base sm:text-lg leading-relaxed max-w-lg">
            Van je eerste surface trick tot geavanceerde inverts — ontdek elke trick met stap-voor-stap instructies.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* FILTERS + GRID */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 py-12 sm:py-16">

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <FilterGroup label="Categorie">
              <FilterLink href="/trickgids" params={params} remove="category" active={!params.category}>
                Alle
              </FilterLink>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <FilterLink key={value} href="/trickgids" params={params} set={{ category: value }} active={params.category === value}>
                  {label}
                </FilterLink>
              ))}
            </FilterGroup>

            <FilterGroup label="Niveau">
              <FilterLink href="/trickgids" params={params} remove="difficulty" active={!params.difficulty}>
                Alle
              </FilterLink>
              {[1, 2, 3, 4, 5].map((n) => (
                <FilterLink key={n} href="/trickgids" params={params} set={{ difficulty: String(n) }} active={params.difficulty === String(n)}>
                  {n} {DIFFICULTY_LABELS[n - 1]}
                </FilterLink>
              ))}
            </FilterGroup>

            <FilterGroup label="Type">
              <FilterLink href="/trickgids" params={params} remove="type" active={!params.type}>
                Alle
              </FilterLink>
              {(['cable', 'boot'] as const).map((t) => (
                <FilterLink key={t} href="/trickgids" params={params} set={{ type: t }} active={params.type === t}>
                  {TYPE_LABELS[t]}
                </FilterLink>
              ))}
            </FilterGroup>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            {tricks.length} {tricks.length === 1 ? 'trick' : 'tricks'} gevonden
          </p>

          {tricks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tricks.map((trick) => (
                <Link
                  key={trick.id}
                  href={`/trickgids/${trick.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    {trick.image_url ? (
                      <img
                        src={trick.image_url}
                        alt={trick.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-slate-200 flex items-center justify-center">
                        <span className="text-4xl opacity-30">🏄</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {trick.category && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[trick.category] ?? 'bg-slate-100 text-slate-600'}`}>
                          {CATEGORY_LABELS[trick.category] ?? trick.category}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-xs text-slate-400">
                        {TYPE_ICONS[trick.trick_type]}
                        {TYPE_LABELS[trick.trick_type]}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-2">
                      {trick.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3.5 h-3.5 ${n <= (trick.difficulty_level ?? 1) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                      <span className="text-xs text-slate-400 ml-1">
                        {DIFFICULTY_LABELS[(trick.difficulty_level ?? 1) - 1]}
                      </span>
                    </div>

                    {trick.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {trick.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg mb-2">Geen tricks gevonden</p>
              <p className="text-sm">Probeer andere filters of bekijk alle tricks.</p>
              <Link href="/trickgids" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-cyan-600 hover:text-cyan-700">
                <ArrowLeft className="w-4 h-4" /> Alle tricks bekijken
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}:</span>
      {children}
    </div>
  )
}

function FilterLink({
  href,
  params,
  set: setParam,
  remove,
  active,
  children,
}: {
  href: string
  params: Record<string, string | undefined>
  set?: Record<string, string>
  remove?: string
  active: boolean
  children: React.ReactNode
}) {
  const newParams = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== remove) newParams.set(k, v)
  }
  if (setParam) {
    for (const [k, v] of Object.entries(setParam)) {
      newParams.set(k, v)
    }
  }
  if (remove) {
    newParams.delete(remove)
  }
  const qs = newParams.toString()

  return (
    <Link
      href={qs ? `${href}?${qs}` : href}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-cyan-600 text-white border-cyan-600'
          : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:text-cyan-700'
      }`}
    >
      {children}
    </Link>
  )
}
