'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import { Spot } from '@/types'

// Fix Leaflet default marker icons
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface SpotMapProps {
  spots: Spot[]
  center?: [number, number]
  zoom?: number
  height?: string
}

export default function SpotMap({
  spots,
  center = [52.3, 5.3],
  zoom = 7,
  height = '500px',
}: SpotMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%' }}
      className="rounded-xl z-0"
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-bold text-sm">{spot.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {spot.city}, {spot.province}
              </p>
              <Link
                href={`/spots/${spot.slug}`}
                className="inline-block mt-2 text-xs text-blue-600 hover:underline font-medium"
              >
                Bekijk spot →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
