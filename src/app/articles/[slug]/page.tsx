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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Terug naar artikelen
        </Link>

        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8"
          />
        )}

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{article.title}</h1>

        {article.published_at && (
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-8">
            <Calendar className="w-4 h-4" />
            {new Date(article.published_at).toLocaleDateString('nl-NL', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </div>
        )}

        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </>
  )
}
