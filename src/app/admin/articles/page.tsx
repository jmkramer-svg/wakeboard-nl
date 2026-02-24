import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, EyeOff, FileText } from 'lucide-react'
import { Article } from '@/types'
import { truncate } from '@/lib/utils'

export default async function AdminArticlesPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const all = (articles ?? []) as Article[]
  const published = all.filter((a) => a.is_published)
  const drafts = all.filter((a) => !a.is_published)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artikelen</h1>
          <p className="text-slate-500 mt-1">{all.length} artikelen • {published.length} gepubliceerd • {drafts.length} concept</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nieuw artikel
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {all.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nog geen artikelen</p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Schrijf het eerste artikel
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Titel</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium hidden md:table-cell">Samenvatting</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {all.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{article.title}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                    {article.excerpt ? truncate(article.excerpt, 80) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    {article.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <Eye className="w-3 h-3" />
                        Gepubliceerd
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        <EyeOff className="w-3 h-3" />
                        Concept
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Bewerken
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
