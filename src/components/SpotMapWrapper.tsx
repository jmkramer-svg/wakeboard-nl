'use client'

import dynamic from 'next/dynamic'
import { Spot } from '@/types'

const SpotMap = dynamic(() => import('./SpotMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 rounded-xl flex items-center justify-center" style={{ minHeight: 300 }}>
      <p className="text-slate-400">Kaart laden...</p>
    </div>
  ),
})

interface SpotMapWrapperProps {
  spots: Spot[]
  center?: [number, number]
  zoom?: number
  height?: string
}

export default function SpotMapWrapper(props: SpotMapWrapperProps) {
  return <SpotMap {...props} />
}
