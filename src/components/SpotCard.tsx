import Link from 'next/link'
import { Spot } from '@/types'
import { TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/utils'
import { MapPin, Waves } from 'lucide-react'

interface SpotCardProps {
  spot: Spot
}

const TYPE_COLORS: Record<string, string> = {
  kabel: 'bg-blue-500',
  boot: 'bg-emerald-500',
  beide: 'bg-purple-500',
}

export default function SpotCard({ spot }: SpotCardProps) {
  return (
    <Link href={`/spots/${spot.slug}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">

        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
          {spot.image_url ? (
            <img
              src={spot.image_url}
              alt={spot.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Waves className="w-16 h-16 text-white/20" />
            </div>
          )}
          {/* Dark overlay op hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${TYPE_COLORS[spot.type]}`}>
              {TYPE_LABELS[spot.type]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-cyan-600 transition-colors">
              {spot.name}
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {DIFFICULTY_LABELS[spot.difficulty]}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{spot.city}, {spot.province}</span>
          </div>

          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {spot.description}
          </p>

          {spot.features.length > 0 && (
            <div className="flex gap-1.5 mt-4 flex-wrap">
              {spot.features.slice(0, 3).map((f) => (
                <span key={f} className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                  {f}
                </span>
              ))}
              {spot.features.length > 3 && (
                <span className="text-xs text-slate-400 px-1 self-center">+{spot.features.length - 3}</span>
              )}
            </div>
          )}
        </div>

      </div>
    </Link>
  )
}
