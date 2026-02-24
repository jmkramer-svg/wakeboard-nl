'use client'

import dynamic from 'next/dynamic'

const CoordPicker = dynamic(() => import('./CoordPicker'), { ssr: false })

interface CoordPickerWrapperProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export default function CoordPickerWrapper(props: CoordPickerWrapperProps) {
  return <CoordPicker {...props} />
}
