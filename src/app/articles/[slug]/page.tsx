import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Article, FaqItem } from '@/types'
import { extractToc, addHeadingIds } from '@/lib/toc'
import { Calendar, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import TableOfContents from '@/components/TableOfContents'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, excerpt, cover_image_url, published_at, target_keywords, focus_keyword')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) return {}

  const title = data.meta_title ?? `${data.title} — Wakeboard NL`
  const description = data.meta_description ?? data.excerpt ?? ''
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

const TRICKGIDS_SLUG = 'de-meest-populaire-wakeboard-tricks-een-complete-gids-voor-beginners-en-gevorderden'

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params

  if (slug === TRICKGIDS_SLUG) redirect('/trickgids')

  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) notFound()

  const article = data as Article
  const faqItems: FaqItem[] = article.faq_items ?? []
  const contentWithIds = addHeadingIds(article.content)
  const toc = article.table_of_contents?.length > 0
    ? article.table_of_contents
    : extractToc(contentWithIds)

  // Enriched Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? article.meta_description,
    image: article.cover_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    keywords: [
      ...(article.focus_keyword ? [article.focus_keyword] : []),
      ...(article.target_keywords ?? []),
    ].join(', ') || undefined,
    author: {
      '@type': 'Organization',
      name: 'Wakeboard NL',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wakeboard NL',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
  }

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Artikelen',
        item: `${siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${siteUrl}/articles/${article.slug}`,
      },
    ],
  }

  // FAQPage JSON-LD (only if FAQ items exist)
  const faqJsonLd = faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

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
          {toc.length > 0 && <TableOfContents items={toc} />}
          <div
            className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />
        </div>
      </div>
    </>
  )
}
