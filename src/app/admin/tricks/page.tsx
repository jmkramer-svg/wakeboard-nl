import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, EyeOff, Zap, Star } from 'lucide-react'
import { Trick } from '@/types'

export default async function AdminTricksPage() {
  const supabase = await createClient()
  const { data: tricks } = await supabase
    .from('tricks')
    .select('*')
    .order('created_at', { ascending: false })

  const all = (tricks ?? []) as Trick[]
  const published = all.filter((t) => t.is_published)
  const drafts = all.filter((t) => !t.is_published)

  const DIFFICULTY_LABELS: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    gevorderd: 'Gevorderd',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trick van de week</h1>
          <p className="text-slate-500 mt-1">{all.length} tricks • {published.length} gepubliceerd • {drafts.length} concept</p>
        </div>
        <Link
          href="/admin/tricks/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nieuwe trick
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {all.length === 0 ? (
          <div className="text-center py-16">
            <Zap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nog geen tricks</p>
            <Link
              href="/admin/tricks/new"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Voeg de eerste trick toe
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Titel</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium hidden md:table-cell">Niveau</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-slate-600 font-medium hidden sm:table-cell">Huidig</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {all.map((trick) => (
                <tr key={trick.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{trick.title}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                    {DIFFICULTY_LABELS[trick.difficulty] ?? trick.difficulty}
                  </td>
                  <td className="px-5 py-3.5">
                    {trick.is_published ? (
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
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {trick.is_current && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">
                        <Star className="w-3 h-3" />
                        Actief
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/tricks/${trick.id}`}
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
