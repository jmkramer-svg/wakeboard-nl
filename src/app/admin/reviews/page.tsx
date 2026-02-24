import { createClient } from '@/lib/supabase/server'
import { Star, Check, Trash2 } from 'lucide-react'
import { approveReview, deleteReview } from './actions'
import { truncate } from '@/lib/utils'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, spots(name)')
    .order('created_at', { ascending: false })

  const all = reviews ?? []
  const pending = all.filter((r) => !r.is_approved)
  const approved = all.filter((r) => r.is_approved)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="text-slate-500 mt-1">
          {pending.length} wachtend op goedkeuring • {approved.length} goedgekeurd
        </p>
      </div>

      {all.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Nog geen reviews</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Auteur</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium hidden md:table-cell">Spot</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Beoordeling</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium hidden lg:table-cell">Preview</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {all.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{review.author_name}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                    {(review.spots as { name: string } | null)?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">
                    {truncate(review.content, 60)}
                  </td>
                  <td className="px-5 py-3.5">
                    {review.is_approved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <Check className="w-3 h-3" />
                        Goedgekeurd
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        Wachtend
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      {!review.is_approved && (
                        <form action={approveReview.bind(null, review.id)}>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Goedkeuren
                          </button>
                        </form>
                      )}
                      <form action={deleteReview.bind(null, review.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Verwijderen
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
