import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ArticleForm from '@/components/ArticleForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Article } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('articles').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <div>
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Terug naar artikelen
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Artikel bewerken</h1>
      <ArticleForm article={data as Article} />
    </div>
  )
}
