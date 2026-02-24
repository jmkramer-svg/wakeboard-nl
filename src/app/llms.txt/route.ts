import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl'

export async function GET() {
  const supabase = await createClient()

  const [{ data: spots }, { data: articles }] = await Promise.all([
    supabase.from('spots').select('name, slug, description, city, province').eq('is_published', true),
    supabase.from('articles').select('title, slug, excerpt').eq('is_published', true),
  ])

  const lines: string[] = [
    '# Wakeboard NL — llms.txt',
    '',
    'Wakeboard NL is de complete gids voor wakeboardspots in Nederland.',
    '',
    '## Wakeboardspots',
    '',
  ]

  for (const spot of (spots ?? [])) {
    lines.push(`### ${spot.name}`)
    lines.push(`URL: ${siteUrl}/spots/${spot.slug}`)
    lines.push(`Locatie: ${spot.city}, ${spot.province}`)
    if (spot.description) lines.push(spot.description)
    lines.push('')
  }

  lines.push('## Artikelen', '')
  for (const article of (articles ?? [])) {
    lines.push(`### ${article.title}`)
    lines.push(`URL: ${siteUrl}/articles/${article.slug}`)
    if (article.excerpt) lines.push(article.excerpt)
    lines.push('')
  }

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
