import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'
import { Spot, Article, Trick } from '@/types'
import { ArrowRight, ChevronRight, Calendar, Play } from 'lucide-react'
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

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-amber-100 text-amber-800',
  gevorderd: 'bg-red-100 text-red-800',
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return null
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: spots }, { data: provinceCounts }, { data: articles }, { data: tricks }] = await Promise.all([
    supabase.from('spots').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
    supabase.from('spots').select('province').eq('is_published', true),
    supabase.from('articles').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('tricks').select('*').eq('is_current', true).eq('is_published', true).limit(1),
  ])

  const featuredSpots: Spot[] = spots ?? []
  const latestArticles: Article[] = articles ?? []
  const currentTrick: Trick | null = (tricks ?? [])[0] ?? null

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
      <section className="relative min-h-[540px] h-auto py-24 sm:py-32 flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610665893833-3692e97e1ee8?auto=format&fit=crop&w=1920&q=80"
          alt=""
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
              Hét meest<br />
              complete<br />
              <span className="text-cyan-400">wakeboard</span><br />
              platform van Nederland!
            </h1>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-6 max-w-md">
              Ontdek kabelbanen, waterski en bootrijden bij jou in de buurt — overal in Nederland.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/articles" className="inline-flex items-center gap-1.5 bg-white/20 border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors text-base backdrop-blur-sm">
                Artikelen
              </Link>
              <Link href="/trickgids" className="inline-flex items-center gap-1.5 bg-white/20 border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors text-base backdrop-blur-sm">
                Trickgids
              </Link>
              <Link href="/wedstrijden" className="inline-flex items-center gap-1.5 bg-white/20 border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors text-base backdrop-blur-sm">
                Wedstrijden
              </Link>
              <Link href="/spots" className="inline-flex items-center gap-1.5 bg-white text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-cyan-50 transition-colors text-base shadow-xl">
                Locaties
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ── LAATSTE NIEUWS ── */}
      {latestArticles.length > 0 && (
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-cyan-600 text-xs font-semibold uppercase tracking-widest mb-2">Vers van de pers</p>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Laatste nieuws</h2>
              </div>
              <Link href="/articles" className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
                Alle artikelen <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-lg transition-all duration-300 bg-slate-100"
                >
                  {article.cover_image_url ? (
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-slate-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {article.published_at && (
                      <p className="text-white/60 text-xs mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.published_at)}
                      </p>
                    )}
                    <h3 className="text-white font-bold text-sm leading-tight mb-2">{article.title}</h3>
                    <span className="text-cyan-400 text-xs font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                      Lees meer <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRICK VAN DE WEEK ── */}
      {currentTrick && (
        <section className="py-20 sm:py-24 bg-slate-900">
          <div className="max-w-6xl mx-auto px-5">
            <div className="mb-10">
              <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">Leer iets nieuws</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Trick van de week</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Afbeelding of video */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 shadow-2xl">
                {currentTrick.video_url && getYouTubeEmbedUrl(currentTrick.video_url) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(currentTrick.video_url)!}
                    title={currentTrick.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : currentTrick.image_url ? (
                  <img
                    src={currentTrick.image_url}
                    alt={currentTrick.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/40 ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 capitalize ${DIFFICULTY_COLORS[currentTrick.difficulty] ?? 'bg-slate-100 text-slate-700'}`}>
                  {currentTrick.difficulty}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-5">{currentTrick.title}</h3>
                <p className="text-white/65 text-base leading-relaxed mb-8 whitespace-pre-line">
                  {currentTrick.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/trickgids/${currentTrick.slug}`}
                    className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm"
                  >
                    Bekijk volledige uitleg
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {currentTrick.video_url && !getYouTubeEmbedUrl(currentTrick.video_url) && (
                    <a
                      href={currentTrick.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm border border-white/20"
                    >
                      <Play className="w-4 h-4" />
                      Bekijk video
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
