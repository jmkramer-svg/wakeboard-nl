import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Article } from '@/types'
import { truncate } from '@/lib/utils'
import { FileText, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Artikelen over wakeboarden in Nederland',
  description: 'Lees onze artikelen over wakeboarden in Nederland: tips, tricks, spots en meer.',
  openGraph: {
    title: 'Artikelen over wakeboarden in Nederland — Wakeboard NL',
    description: 'Tips, tricks en nieuws over wakeboarden in Nederland.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikelen over wakeboarden — Wakeboard NL',
    description: 'Tips, tricks en nieuws over wakeboarden in Nederland.',
  },
  alternates: {
    canonical: '/articles',
  },
}

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const articles = (data ?? []) as Article[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Artikelen</h1>
        <p className="text-slate-500 mt-2">Tips, tricks en nieuws over wakeboarden in Nederland</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nog geen artikelen gepubliceerd</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {article.cover_image_url ? (
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-white/40" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {truncate(article.excerpt, 120)}
                  </p>
                )}
                {article.published_at && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.published_at).toLocaleDateString('nl-NL', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
