import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'
import SpotFilters from '@/components/SpotFilters'
import SpotMapWrapper from '@/components/SpotMapWrapper'
import { Spot } from '@/types'
import { Waves, Map } from 'lucide-react'

interface SpotsPageProps {
  searchParams: Promise<{
    province?: string
    type?: string
    difficulty?: string
    search?: string
    view?: string
  }>
}

export default async function SpotsPage({ searchParams }: SpotsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('spots')
    .select('*')
    .eq('is_published', true)
    .order('name')

  if (params.province) query = query.eq('province', params.province)
  if (params.type) query = query.eq('type', params.type)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,city.ilike.%${params.search}%`)
  }

  const { data, error } = await query
  const spots: Spot[] = data ?? []
  const showMap = params.view === 'map'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Wakeboardspots</h1>
        <p className="text-slate-500 mt-1">
          {spots.length} {spots.length === 1 ? 'spot' : 'spots'} gevonden
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense>
          <SpotFilters />
        </Suspense>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        <a
          href={`/spots?${new URLSearchParams({ ...params, view: '' }).toString()}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showMap
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Lijst
        </a>
        <a
          href={`/spots?${new URLSearchParams({ ...params, view: 'map' }).toString()}`}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showMap
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Map className="w-4 h-4" />
          Kaart
        </a>
      </div>

      {/* No results */}
      {spots.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Waves className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Geen spots gevonden</p>
          <p className="text-slate-400 text-sm mt-1">Probeer andere filters</p>
        </div>
      )}

      {/* Map view */}
      {showMap && spots.length > 0 && (
        <SpotMapWrapper spots={spots} height="600px" />
      )}

      {/* Grid view */}
      {!showMap && spots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}
    </div>
  )
}
