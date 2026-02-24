import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [{ data: spots }, { data: articles }] = await Promise.all([
    supabase.from('spots').select('slug, updated_at').eq('is_published', true),
    supabase.from('articles').select('slug, updated_at').eq('is_published', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/spots`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const spotRoutes: MetadataRoute.Sitemap = (spots ?? []).map((s) => ({
    url: `${siteUrl}/spots/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${siteUrl}/articles/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...spotRoutes, ...articleRoutes]
}
