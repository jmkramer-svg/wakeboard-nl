import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, EyeOff, Pencil } from 'lucide-react'

export default async function AdminSpotsPage() {
  const supabase = await createClient()
  const { data: spots } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false })

  const allSpots = spots ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Spots beheren</h1>
        <Link
          href="/admin/spots/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nieuwe spot
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {allSpots.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p>Nog geen spots aangemaakt.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-600">Naam</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Locatie</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Type</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Niveau</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allSpots.map((spot) => (
                <tr key={spot.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{spot.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{spot.city}, {spot.province}</td>
                  <td className="px-5 py-3.5 text-slate-500 capitalize">{spot.type}</td>
                  <td className="px-5 py-3.5 text-slate-500 capitalize">{spot.difficulty}</td>
                  <td className="px-5 py-3.5">
                    {spot.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <Eye className="w-3 h-3" /> Gepubliceerd
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        <EyeOff className="w-3 h-3" /> Concept
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/spots/${spot.id}`}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
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
