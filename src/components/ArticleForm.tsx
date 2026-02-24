'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Article } from '@/types'
import { slugify } from '@/lib/utils'
import { Save, Eye, Trash2, Sparkles, X } from 'lucide-react'
import RichTextEditor, { RichTextEditorHandle } from './RichTextEditor'
import ImageUploader from './ImageUploader'

type ArticleFormData = Omit<Article, 'id' | 'created_at' | 'updated_at'>

interface ArticleFormProps {
  article?: Article
}

const defaultValues: ArticleFormData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image_url: '',
  meta_title: '',
  meta_description: '',
  focus_keyword: '',
  is_published: false,
  published_at: null,
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const isEdit = !!article
  const editorRef = useRef<RichTextEditorHandle>(null)

  const [form, setForm] = useState<ArticleFormData>(
    article
      ? {
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt ?? '',
          cover_image_url: article.cover_image_url ?? '',
          meta_title: article.meta_title ?? '',
          meta_description: article.meta_description ?? '',
          focus_keyword: article.focus_keyword ?? '',
          is_published: article.is_published,
          published_at: article.published_at,
        }
      : defaultValues
  )

  const [activeTab, setActiveTab] = useState<'inhoud' | 'seo'>('inhoud')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // AI generator state
  const [showAI, setShowAI] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  function set<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: isEdit ? prev.slug : slugify(value),
    }))
  }

  async function handleSave(publish?: boolean) {
    setSaving(true)
    setError('')
    const supabase = createClient()

    const now = new Date().toISOString()
    const shouldPublish = publish !== undefined ? publish : form.is_published
    const payload = {
      ...form,
      content: editorRef.current?.getContent() ?? form.content,
      excerpt: form.excerpt || null,
      cover_image_url: form.cover_image_url || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      focus_keyword: form.focus_keyword || null,
      is_published: shouldPublish,
      published_at: shouldPublish && !form.published_at ? now : form.published_at,
      updated_at: now,
    }

    let err
    if (isEdit) {
      const { error } = await supabase.from('articles').update(payload).eq('id', article!.id)
      err = error
    } else {
      const { error } = await supabase.from('articles').insert({ ...payload, created_at: now })
      err = error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    router.push('/admin/articles')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${form.title}" wilt verwijderen?`)) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('articles').delete().eq('id', article!.id)
    router.push('/admin/articles')
    router.refresh()
  }

  async function handleGenerate() {
    if (!aiTopic.trim()) return
    setAiLoading(true)
    setAiError('')

    try {
      const res = await fetch('/api/admin/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Genereren mislukt')
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        // Strip JSON block at the end before showing in editor
        const htmlPart = fullText.replace(/```json[\s\S]*?```/g, '').trim()
        editorRef.current?.setContent(htmlPart)
      }

      // Extract SEO JSON block
      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)```/)
      if (jsonMatch) {
        try {
          const seo = JSON.parse(jsonMatch[1])
          setForm((prev) => ({
            ...prev,
            meta_title: seo.meta_title ?? prev.meta_title,
            meta_description: seo.meta_description ?? prev.meta_description,
            focus_keyword: seo.focus_keyword ?? prev.focus_keyword,
            excerpt: seo.excerpt ?? prev.excerpt,
          }))
        } catch {}
      }

      setShowAI(false)
      setAiTopic('')
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : 'Onbekende fout')
    } finally {
      setAiLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <div className="max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {(['inhoud', 'seo'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'inhoud' ? 'Inhoud' : 'SEO'}
          </button>
        ))}
        <div className="ml-auto flex items-center pb-2">
          <button
            type="button"
            onClick={() => setShowAI(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI genereren
          </button>
        </div>
      </div>

      {/* Tab: Inhoud — altijd gerenderd, CSS hide/show */}
      <div className={activeTab === 'inhoud' ? 'block' : 'hidden'}>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Titel *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Artikeltitel"
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              className={inputClass}
              placeholder="auto-gegenereerd-uit-titel"
            />
          </div>
          <div>
            <label className={labelClass}>Samenvatting</label>
            <textarea
              value={form.excerpt ?? ''}
              onChange={(e) => set('excerpt', e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Korte samenvatting (optioneel)"
            />
          </div>
          <div>
            <label className={labelClass}>Omslagafbeelding</label>
            <ImageUploader
              value={form.cover_image_url ?? ''}
              onChange={(url) => set('cover_image_url', url)}
              bucket="article-images"
            />
          </div>
          <div>
            <label className={labelClass}>Inhoud *</label>
            <RichTextEditor
              ref={editorRef}
              content={form.content}
              onChange={(html) => set('content', html)}
              placeholder="Begin met schrijven..."
            />
          </div>
        </div>
      </div>

      {/* Tab: SEO */}
      <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Meta titel</label>
            <input
              type="text"
              value={form.meta_title ?? ''}
              onChange={(e) => set('meta_title', e.target.value)}
              className={inputClass}
              placeholder="SEO paginatitel (max 60 tekens)"
            />
            <p className="text-xs text-slate-400 mt-1">{(form.meta_title ?? '').length} / 60</p>
          </div>
          <div>
            <label className={labelClass}>Meta beschrijving</label>
            <textarea
              value={form.meta_description ?? ''}
              onChange={(e) => set('meta_description', e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Beschrijving in zoekresultaten (max 160 tekens)"
            />
            <p className="text-xs text-slate-400 mt-1">{(form.meta_description ?? '').length} / 160</p>
          </div>
          <div>
            <label className={labelClass}>Focus zoekwoord</label>
            <input
              type="text"
              value={form.focus_keyword ?? ''}
              onChange={(e) => set('focus_keyword', e.target.value)}
              className={inputClass}
              placeholder="bijv. wakeboarden nederland"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <div className="flex gap-3">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Concept opslaan'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            {saving ? 'Publiceren...' : 'Publiceren'}
          </button>
        </div>
        {isEdit && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Verwijderen...' : 'Verwijderen'}
          </button>
        )}
      </div>

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Artikelgenerator
              </h3>
              <button type="button" onClick={() => { setShowAI(false); setAiError('') }}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Beschrijf het onderwerp en de AI genereert een volledig artikel met SEO-optimalisatie.
            </p>
            <textarea
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
              placeholder="bijv. 'De beste kabelbanen van Nederland voor beginners'"
            />
            {aiError && <p className="text-sm text-red-600 mb-3">{aiError}</p>}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={aiLoading || !aiTopic.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading ? 'Genereren...' : 'Artikel genereren'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
