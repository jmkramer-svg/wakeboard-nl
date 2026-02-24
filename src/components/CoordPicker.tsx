'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface ClickHandlerProps {
  onCoords: (lat: number, lng: number) => void
}

function ClickHandler({ onCoords }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      onCoords(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface CoordPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export default function CoordPicker({ lat, lng, onChange }: CoordPickerProps) {
  const [position, setPosition] = useState<[number, number]>([lat, lng])

  function handleCoords(newLat: number, newLng: number) {
    const rounded: [number, number] = [
      Math.round(newLat * 1e6) / 1e6,
      Math.round(newLng * 1e6) / 1e6,
    ]
    setPosition(rounded)
    onChange(rounded[0], rounded[1])
  }

  return (
    <div>
      <MapContainer
        center={position}
        zoom={8}
        style={{ height: '280px', width: '100%' }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onCoords={handleCoords} />
        <Marker
          position={position}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(e) {
              const m = e.target
              const pos = m.getLatLng()
              handleCoords(pos.lat, pos.lng)
            },
          }}
        />
      </MapContainer>
      <p className="text-xs text-slate-500 mt-1.5">Klik op de kaart of sleep de marker om de locatie in te stellen.</p>
    </div>
  )
}
