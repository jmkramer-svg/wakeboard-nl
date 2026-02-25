'use client'

import { TocItem } from '@/types'

interface Props {
  items: TocItem[]
}

export default function TableOfContents({ items }: Props) {
  if (items.length === 0) return null

  return (
    <nav className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
        Inhoudsopgave
      </h2>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-sm text-cyan-700 hover:text-cyan-900 hover:underline transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
