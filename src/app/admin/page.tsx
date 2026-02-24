import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Waves, Plus, Eye, EyeOff, FileText, Star } from 'lucide-react'
import { truncate } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { data: spots },
    { data: articles },
    { count: pendingReviews },
    { data: recentSpots },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from('spots').select('id, is_published'),
    supabase.from('articles').select('id, is_published'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('spots').select('id, name, city, province, is_published, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('articles').select('id, title, is_published, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const allSpots = spots ?? []
  const publishedSpots = allSpots.filter((s) => s.is_published)
  const draftSpots = allSpots.filter((s) => !s.is_published)

  const allArticles = articles ?? []
  const publishedArticles = allArticles.filter((a) => a.is_published)

  const stats = [
    { label: 'Spots totaal', value: allSpots.length, color: 'text-slate-900', href: '/admin/spots' },
    { label: 'Spots gepubliceerd', value: publishedSpots.length, color: 'text-green-600', href: '/admin/spots' },
    { label: 'Spots concept', value: draftSpots.length, color: 'text-amber-600', href: '/admin/spots' },
    { label: 'Artikelen totaal', value: allArticles.length, color: 'text-slate-900', href: '/admin/articles' },
    { label: 'Artikelen gepubliceerd', value: publishedArticles.length, color: 'text-green-600', href: '/admin/articles' },
    { label: 'Reviews wachtend', value: pendingReviews ?? 0, color: 'text-red-500', href: '/admin/reviews' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overzicht van je Wakeboard NL CMS</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/spots/new"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Waves className="w-4 h-4" />
            Nieuwe baan
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Nieuw artikel
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
          >
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent spots */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-500" />
              Recente spots
            </h2>
            <Link href="/admin/spots" className="text-sm text-blue-600 hover:text-blue-700">
              Alles →
            </Link>
          </div>
          {(recentSpots ?? []).length === 0 ? (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">Nog geen spots</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {(recentSpots ?? []).map((spot) => (
                <Link
                  key={spot.id}
                  href={`/admin/spots/${spot.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{spot.name}</p>
                    <p className="text-xs text-slate-400">{spot.city}, {spot.province}</p>
                  </div>
                  {spot.is_published ? (
                    <Eye className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent articles */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              Recente artikelen
            </h2>
            <Link href="/admin/articles" className="text-sm text-blue-600 hover:text-blue-700">
              Alles →
            </Link>
          </div>
          {(recentArticles ?? []).length === 0 ? (
            <div className="px-5 py-8 text-center text-slate-400 text-sm">Nog geen artikelen</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {(recentArticles ?? []).map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-900">{truncate(article.title, 50)}</p>
                  {article.is_published ? (
                    <Eye className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {(pendingReviews ?? 0) > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-800">
              {pendingReviews} review{(pendingReviews ?? 0) !== 1 ? 's' : ''} wachten op goedkeuring
            </p>
          </div>
          <Link
            href="/admin/reviews"
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Bekijken →
          </Link>
        </div>
      )}
    </div>
  )
}
