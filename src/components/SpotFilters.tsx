'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PROVINCES, TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useTransition } from 'react'

export default function SpotFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentProvince = searchParams.get('province') || ''
  const currentType = searchParams.get('type') || ''
  const currentDifficulty = searchParams.get('difficulty') || ''
  const currentSearch = searchParams.get('search') || ''

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => {
      router.push(`/spots?${params.toString()}`)
    })
  }

  function clearAll() {
    startTransition(() => {
      router.push('/spots')
    })
  }

  const hasFilters = currentProvince || currentType || currentDifficulty || currentSearch

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Zoekbalk */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Zoeken</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Naam of stad..."
              defaultValue={currentSearch}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Provincie */}
        <div className="min-w-[160px]">
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Provincie</label>
          <select
            value={currentProvince}
            onChange={(e) => updateFilter('province', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Alle provincies</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Type</label>
          <select
            value={currentType}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Alle types</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Niveau */}
        <div className="min-w-[150px]">
          <label className="text-xs font-medium text-slate-600 block mb-1.5">Niveau</label>
          <select
            value={currentDifficulty}
            onChange={(e) => updateFilter('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Alle niveaus</option>
            {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {isPending && (
        <p className="text-xs text-blue-500 mt-2">Filteren...</p>
      )}
    </div>
  )
}
