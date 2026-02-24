import ArticleForm from '@/components/ArticleForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewArticlePage() {
  return (
    <div>
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Terug naar artikelen
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Nieuw artikel</h1>
      <ArticleForm />
    </div>
  )
}
