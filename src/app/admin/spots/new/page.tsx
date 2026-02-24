import SpotForm from '@/components/SpotForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewSpotPage() {
  return (
    <div>
      <Link
        href="/admin/spots"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Terug naar spots
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Nieuwe spot toevoegen</h1>
      <SpotForm />
    </div>
  )
}
