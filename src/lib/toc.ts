import { TocItem } from '@/types'
import { slugify } from './utils'

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([23])[^>]*?(?:id=["']([^"']*)["'])?[^>]*>([\s\S]*?)<\/h\1>/gi
  let match

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const existingId = match[2]
    const text = match[3].replace(/<[^>]*>/g, '').trim()
    const id = existingId || slugify(text)

    items.push({ id, text, level })
  }

  return items
}

export function addHeadingIds(html: string): string {
  const usedIds = new Set<string>()

  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (fullMatch, level, attrs, inner) => {
      if (/id=["']/.test(attrs)) return fullMatch

      const text = inner.replace(/<[^>]*>/g, '').trim()
      let id = slugify(text)

      // Ensure unique IDs
      let counter = 1
      const baseId = id
      while (usedIds.has(id)) {
        id = `${baseId}-${counter++}`
      }
      usedIds.add(id)

      return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`
    }
  )
}
