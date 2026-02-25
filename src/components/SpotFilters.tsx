'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PROVINCES, DIFFICULTY_LABELS } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useTransition } from 'react'

export default function SpotFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentProvince   = searchParams.get('province')   || ''
  const currentType       = searchParams.get('type')       || ''
  const currentDifficulty = searchParams.get('difficulty') || ''
  const currentSearch     = searchParams.get('search')     || ''

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set(key, value) } else { params.delete(key) }
    params.delete('page')
    startTransition(() => { router.push(`/spots?${params.toString()}`) })
  }

  function clearAll() {
    startTransition(() => { router.push('/spots') })
  }

  const hasFilters = currentProvince || currentType || currentDifficulty || currentSearch

  const typeOptions = [
    { value: '',      label: 'Alle spots' },
    { value: 'kabel', label: '⚡ Kabelbaan' },
    { value: 'boot',  label: '🚤 Bootrijden' },
    { value: 'beide', label: '🏆 Kabel & Boot' },
  ]

  return (
    <div className={`flex items-center gap-2 transition-opacity ${isPending ? 'opacity-50' : ''}`}>

      {/* Search */}
      <div className="relative flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Zoek een spot..."
          defaultValue={currentSearch}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200 focus:bg-white border border-transparent focus:border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 w-40 sm:w-44 transition-all"
        />
      </div>

      <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

      {/* Type pills */}
      {typeOptions.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => updateFilter('type', value)}
          className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
            currentType === value
              ? 'bg-slate-900 text-white shadow-sm scale-[1.02]'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          {label}
        </button>
      ))}

      <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

      {/* Province */}
      <select
        value={currentProvince}
        onChange={(e) => updateFilter('province', e.target.value)}
        className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer transition-all border-none appearance-none ${
          currentProvince
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <option value="">Provincie</option>
        {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      {/* Level */}
      <select
        value={currentDifficulty}
        onChange={(e) => updateFilter('difficulty', e.target.value)}
        className={`flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer transition-all border-none appearance-none ${
          currentDifficulty
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <option value="">Niveau</option>
        {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>

      {/* Reset */}
      {hasFilters && (
        <>
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
          <button
            onClick={clearAll}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </>
      )}
    </div>
  )
}
