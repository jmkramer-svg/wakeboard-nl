import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SpotForm from '@/components/SpotForm'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'

interface EditSpotPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSpotPage({ params }: EditSpotPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: spot } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single()

  if (!spot) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/spots"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Terug naar spots
        </Link>
        {spot.is_published && (
          <Link
            href={`/spots/${spot.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            Bekijk live
          </Link>
        )}
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">
        {spot.name} bewerken
      </h1>
      <SpotForm spot={spot} />
    </div>
  )
}
