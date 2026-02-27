import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TrickForm from '@/components/TrickForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Trick } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTrickPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('tricks').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <div>
      <Link
        href="/admin/tricks"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Terug naar tricks
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Trick bewerken</h1>
      <TrickForm trick={data as Trick} />
    </div>
  )
}
