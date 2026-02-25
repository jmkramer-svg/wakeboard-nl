import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Article } from '@/types'
import { Calendar, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, excerpt, cover_image_url, published_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) return {}

  const title = data.meta_title ?? `${data.title} — Wakeboard NL`
  const description = data.meta_description ?? data.excerpt ?? ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: data.published_at ?? undefined,
      images: data.cover_image_url ? [data.cover_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: data.cover_image_url ? [data.cover_image_url] : [],
    },
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) notFound()

  const article = data as Article

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? article.meta_description,
    image: article.cover_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'Wakeboard NL',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[45vh] sm:min-h-[55vh] flex items-end">
        {/* Background: cover photo or dark gradient */}
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[#050e1a]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#071d31] via-[#050e1a] to-[#030b15]" />
            <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Content in hero */}
        <div className="relative w-full max-w-3xl mx-auto px-5 pb-12 pt-20">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Terug naar artikelen
          </Link>

          {article.published_at && (
            <div className="flex items-center gap-1.5 text-white/45 text-sm mb-4">
              <Calendar className="w-4 h-4" />
              {new Date(article.published_at).toLocaleDateString('nl-NL', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-white/50 mt-4 text-base sm:text-lg leading-relaxed max-w-2xl">
              {article.excerpt}
            </p>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── CONTENT ── */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
          <div
            className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </>
  )
}
