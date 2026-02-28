import { createClient } from '@/lib/supabase/server'
import { Article } from '@/types'
import { extractToc, addHeadingIds } from '@/lib/toc'
import TableOfContents from '@/components/TableOfContents'
import type { Metadata } from 'next'

const TRICKGIDS_SLUG = 'de-meest-populaire-wakeboard-tricks-een-complete-gids-voor-beginners-en-gevorderden'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, excerpt, cover_image_url, focus_keyword, target_keywords')
    .eq('slug', TRICKGIDS_SLUG)
    .single()

  if (!data) {
    return {
      title: 'Trickgids — Wakeboard NL',
      description: 'De complete gids voor wakeboard tricks: van beginner tot gevorderd.',
    }
  }

  const title = data.meta_title ?? 'Trickgids — Wakeboard NL'
  const description = data.meta_description ?? data.excerpt ?? 'De complete gids voor wakeboard tricks.'
  const keywords = [
    ...(data.focus_keyword ? [data.focus_keyword] : []),
    ...(data.target_keywords ?? []),
  ]

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      images: data.cover_image_url ? [data.cover_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: data.cover_image_url ? [data.cover_image_url] : [],
    },
    alternates: { canonical: '/trickgids' },
  }
}

export default async function TrickgidsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', TRICKGIDS_SLUG)
    .single()

  const article = data as Article | null
  const contentWithIds = article ? addHeadingIds(article.content) : ''
  const toc = article
    ? (article.table_of_contents?.length > 0 ? article.table_of_contents : extractToc(contentWithIds))
    : []

  return (
    <>
      {/* ── HERO ── */}
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

        <div className="relative max-w-3xl mx-auto px-5 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-[0.18em]">
              Trickgids
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.92]">
            Wakeboard{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400">
              Tricks
            </span>
          </h1>
          <p className="text-white/35 mt-5 text-base sm:text-lg leading-relaxed max-w-lg">
            {article?.excerpt ?? 'De complete gids voor wakeboard tricks: van beginner tot gevorderd.'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── CONTENT ── */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
          {article ? (
            <>
              {toc.length > 0 && <TableOfContents items={toc} />}
              <div
                className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            </>
          ) : (
            <p className="text-slate-500 text-center py-20">
              De trickgids wordt binnenkort toegevoegd.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
