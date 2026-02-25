import Link from 'next/link'
import { Spot } from '@/types'
import { TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/utils'
import { MapPin, ArrowRight, Waves } from 'lucide-react'

interface SpotCardProps {
  spot: Spot
}

const TYPE_COLORS: Record<string, string> = {
  kabel:  'bg-blue-500',
  boot:   'bg-emerald-500',
  beide:  'bg-violet-500',
}

export default function SpotCard({ spot }: SpotCardProps) {
  return (
    <Link href={`/spots/${spot.slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">

        {/* Background image */}
        {spot.image_url ? (
          <img
            src={spot.image_url}
            alt={spot.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <Waves className="w-16 h-16 text-white/20" />
          </div>
        )}

        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
        {/* Hover deepen */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Top row: badge + CTA */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${TYPE_COLORS[spot.type]}`}>
            {TYPE_LABELS[spot.type]}
          </span>
          <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            Bekijk <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1 text-white/55 text-xs mb-1.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{spot.city}, {spot.province}</span>
          </div>
          <h3 className="text-white font-black text-lg leading-tight group-hover:text-cyan-300 transition-colors duration-300 drop-shadow">
            {spot.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/55 text-xs bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
              {DIFFICULTY_LABELS[spot.difficulty]}
            </span>
            {spot.features.length > 0 && (
              <span className="text-white/35 text-xs">{spot.features.length} faciliteiten</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
