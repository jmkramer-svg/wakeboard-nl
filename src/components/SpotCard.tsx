import Link from 'next/link'
import { Spot } from '@/types'
import { TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/utils'
import { MapPin, Waves, Star } from 'lucide-react'

interface SpotCardProps {
  spot: Spot
}

const TYPE_COLORS: Record<string, string> = {
  kabel: 'bg-blue-100 text-blue-700',
  boot: 'bg-green-100 text-green-700',
  beide: 'bg-purple-100 text-purple-700',
}

export default function SpotCard({ spot }: SpotCardProps) {
  return (
    <Link href={`/spots/${spot.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-cyan-600 overflow-hidden">
          {spot.image_url ? (
            <img
              src={spot.image_url}
              alt={spot.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Waves className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[spot.type]}`}>
              {TYPE_LABELS[spot.type]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {spot.name}
          </h3>

          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{spot.city}, {spot.province}</span>
          </div>

          <p className="text-slate-600 text-sm mt-2.5 line-clamp-2 leading-relaxed">
            {spot.description}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {DIFFICULTY_LABELS[spot.difficulty]}
            </span>
            {spot.features.length > 0 && (
              <div className="flex gap-1">
                {spot.features.slice(0, 2).map((f) => (
                  <span key={f} className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                    {f}
                  </span>
                ))}
                {spot.features.length > 2 && (
                  <span className="text-xs text-slate-400 px-1">+{spot.features.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
