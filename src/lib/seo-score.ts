import { FaqItem } from '@/types'

export interface SeoCheck {
  label: string
  passed: boolean
}

export interface SeoResult {
  score: number
  checks: SeoCheck[]
}

export function calculateSeoScore(params: {
  content: string
  title: string
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  faqItems: FaqItem[]
  excerpt: string | null
}): SeoResult {
  const { content, title, metaTitle, metaDescription, focusKeyword, faqItems, excerpt } = params
  const keyword = (focusKeyword ?? '').toLowerCase()
  const contentLower = content.toLowerCase()
  const plainText = content.replace(/<[^>]*>/g, '')

  const checks: SeoCheck[] = []

  // 1. Meta titel lengte (30-60 tekens)
  const metaTitleLen = (metaTitle ?? '').length
  checks.push({
    label: `Meta titel lengte (${metaTitleLen}/60)`,
    passed: metaTitleLen >= 30 && metaTitleLen <= 60,
  })

  // 2. Meta beschrijving lengte (120-160 tekens)
  const metaDescLen = (metaDescription ?? '').length
  checks.push({
    label: `Meta beschrijving lengte (${metaDescLen}/160)`,
    passed: metaDescLen >= 120 && metaDescLen <= 160,
  })

  // 3. Focus-keyword in titel
  checks.push({
    label: 'Focus-keyword in titel',
    passed: !!keyword && title.toLowerCase().includes(keyword),
  })

  // 4. Focus-keyword in meta titel
  checks.push({
    label: 'Focus-keyword in meta titel',
    passed: !!keyword && (metaTitle ?? '').toLowerCase().includes(keyword),
  })

  // 5. Focus-keyword in eerste alinea
  const firstPMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const firstParagraph = (firstPMatch?.[1] ?? '').toLowerCase().replace(/<[^>]*>/g, '')
  checks.push({
    label: 'Focus-keyword in eerste alinea',
    passed: !!keyword && firstParagraph.includes(keyword),
  })

  // 6. Minimaal 2 H2-kopjes
  const h2Count = (content.match(/<h2[\s>]/gi) ?? []).length
  checks.push({
    label: `H2-kopjes aanwezig (${h2Count})`,
    passed: h2Count >= 2,
  })

  // 7. Artikellengte minimaal 1000 woorden
  const wordCount = plainText.split(/\s+/).filter(Boolean).length
  checks.push({
    label: `Artikellengte (${wordCount} woorden)`,
    passed: wordCount >= 1000,
  })

  // 8. FAQ-sectie met minimaal 3 items
  checks.push({
    label: `FAQ-items (${faqItems.length})`,
    passed: faqItems.length >= 3,
  })

  // 9. Samenvatting/excerpt aanwezig
  checks.push({
    label: 'Samenvatting aanwezig',
    passed: !!(excerpt && excerpt.trim().length > 10),
  })

  // 10. Interne links aanwezig
  const internalLinkCount = (contentLower.match(/href=["'][^"']*wakeboard-nl|href=["']\/(?!\/)/gi) ?? []).length
  checks.push({
    label: `Interne links (${internalLinkCount})`,
    passed: internalLinkCount >= 1,
  })

  const score = checks.filter((c) => c.passed).length

  return { score, checks }
}
