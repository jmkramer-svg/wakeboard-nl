import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Article } from '@/types'
import { truncate } from '@/lib/utils'
import { FileText, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Artikelen over wakeboarden in Nederland',
  description: 'Lees onze artikelen over wakeboarden in Nederland: tips, tricks, spots en meer.',
  openGraph: {
    title: 'Artikelen over wakeboarden in Nederland — Wakeboard NL',
    description: 'Tips, tricks en nieuws over wakeboarden in Nederland.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikelen over wakeboarden — Wakeboard NL',
    description: 'Tips, tricks en nieuws over wakeboarden in Nederland.',
  },
  alternates: { canonical: '/articles' },
}

const TRICKGIDS_SLUG = 'de-meest-populaire-wakeboard-tricks-een-complete-gids-voor-beginners-en-gevorderden'

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .neq('slug', TRICKGIDS_SLUG)
    .order('published_at', { ascending: false })

  const articles = (data ?? []) as Article[]

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#050e1a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071d31] via-[#050e1a] to-[#030b15]" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-sky-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-indigo-600/8 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-[0.18em]">
              {articles.length} {articles.length === 1 ? 'artikel' : 'artikelen'}
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-black text-white tracking-tight leading-[0.92]">
            Artikelen &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
              Nieuws
            </span>
          </h1>
          <p className="text-white/35 mt-5 text-base sm:text-lg leading-relaxed max-w-lg">
            Tips, tricks en het laatste nieuws over wakeboarden in Nederland.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── GRID ── */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">
          {articles.length === 0 ? (
            <div className="text-center py-28">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-800 font-bold text-xl mb-1">Nog geen artikelen</p>
              <p className="text-slate-400 text-sm">Kom snel terug voor nieuws en tips</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">

                    {article.cover_image_url ? (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-slate-800 to-slate-900 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-white/15" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Top: date + CTA */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      {article.published_at && (
                        <span className="text-xs font-semibold bg-black/40 backdrop-blur-sm text-white/70 px-2.5 py-1 rounded-full border border-white/10">
                          {new Date(article.published_at).toLocaleDateString('nl-NL', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="ml-auto bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        Lees meer <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Bottom: title + excerpt */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-white font-black text-base leading-tight group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2 drop-shadow">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="text-white/45 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {truncate(article.excerpt, 100)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
