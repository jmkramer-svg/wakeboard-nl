'use client'

import { useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Article, FaqItem } from '@/types'
import { slugify } from '@/lib/utils'
import { calculateSeoScore, SeoCheck } from '@/lib/seo-score'
import { extractToc, addHeadingIds } from '@/lib/toc'
import { Save, Eye, Trash2, Sparkles, X, Plus, GripVertical } from 'lucide-react'
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
  faq_items: [],
  table_of_contents: [],
  target_keywords: [],
  seo_score: 0,
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
          faq_items: article.faq_items ?? [],
          table_of_contents: article.table_of_contents ?? [],
          target_keywords: article.target_keywords ?? [],
          seo_score: article.seo_score ?? 0,
          is_published: article.is_published,
          published_at: article.published_at,
        }
      : defaultValues
  )

  const [activeTab, setActiveTab] = useState<'inhoud' | 'seo' | 'faq'>('inhoud')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // AI generator state
  const [showAI, setShowAI] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  // Target keywords as comma-separated string for editing
  const [targetKeywordsStr, setTargetKeywordsStr] = useState(
    (article?.target_keywords ?? []).join(', ')
  )

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

  // --- FAQ helpers ---
  function addFaqItem() {
    setForm((prev) => ({
      ...prev,
      faq_items: [...prev.faq_items, { question: '', answer: '' }],
    }))
  }

  function updateFaqItem(index: number, field: keyof FaqItem, value: string) {
    setForm((prev) => {
      const items = [...prev.faq_items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, faq_items: items }
    })
  }

  function removeFaqItem(index: number) {
    setForm((prev) => ({
      ...prev,
      faq_items: prev.faq_items.filter((_, i) => i !== index),
    }))
  }

  // --- SEO Score ---
  const seoResult = useMemo(() => {
    const content = editorRef.current?.getContent() ?? form.content
    return calculateSeoScore({
      content,
      title: form.title,
      metaTitle: form.meta_title || null,
      metaDescription: form.meta_description || null,
      focusKeyword: form.focus_keyword || null,
      faqItems: form.faq_items,
      excerpt: form.excerpt || null,
    })
  }, [form.title, form.meta_title, form.meta_description, form.focus_keyword, form.faq_items, form.excerpt, form.content])

  function scoreColor(score: number): string {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 5) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  function checkIcon(passed: boolean) {
    return passed ? '✓' : '✗'
  }

  async function handleSave(publish?: boolean) {
    setSaving(true)
    setError('')
    const supabase = createClient()

    const now = new Date().toISOString()
    const shouldPublish = publish !== undefined ? publish : form.is_published
    const currentContent = editorRef.current?.getContent() ?? form.content

    // Add heading IDs and extract TOC
    const contentWithIds = addHeadingIds(currentContent)
    const toc = extractToc(contentWithIds)

    // Parse target keywords from comma string
    const keywords = targetKeywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    // Calculate final SEO score
    const { score } = calculateSeoScore({
      content: contentWithIds,
      title: form.title,
      metaTitle: form.meta_title || null,
      metaDescription: form.meta_description || null,
      focusKeyword: form.focus_keyword || null,
      faqItems: form.faq_items,
      excerpt: form.excerpt || null,
    })

    const payload = {
      ...form,
      content: contentWithIds,
      excerpt: form.excerpt || null,
      cover_image_url: form.cover_image_url || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      focus_keyword: form.focus_keyword || null,
      faq_items: form.faq_items.filter((f) => f.question.trim() && f.answer.trim()),
      table_of_contents: toc,
      target_keywords: keywords,
      seo_score: score,
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

      // Extract title from H1
      const h1Match = fullText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
      const extractedTitle = h1Match
        ? h1Match[1].replace(/<[^>]*>/g, '').trim()
        : ''

      // Extract SEO JSON block
      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)```/)
      if (jsonMatch) {
        try {
          const seo = JSON.parse(jsonMatch[1])
          setForm((prev) => ({
            ...prev,
            title: extractedTitle || prev.title,
            slug: extractedTitle && !isEdit ? slugify(extractedTitle) : prev.slug,
            meta_title: seo.meta_title ?? prev.meta_title,
            meta_description: seo.meta_description ?? prev.meta_description,
            focus_keyword: seo.focus_keyword ?? prev.focus_keyword,
            excerpt: seo.excerpt ?? prev.excerpt,
            faq_items: Array.isArray(seo.faq_items) ? seo.faq_items : prev.faq_items,
            target_keywords: Array.isArray(seo.target_keywords) ? seo.target_keywords : prev.target_keywords,
          }))
          if (Array.isArray(seo.target_keywords)) {
            setTargetKeywordsStr(seo.target_keywords.join(', '))
          }
        } catch {}
      } else if (extractedTitle) {
        setForm((prev) => ({
          ...prev,
          title: extractedTitle,
          slug: !isEdit ? slugify(extractedTitle) : prev.slug,
        }))
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
        {(['inhoud', 'seo', 'faq'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'inhoud' ? 'Inhoud' : tab === 'seo' ? 'SEO' : 'FAQ'}
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

      {/* Tab: Inhoud */}
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
          {/* SEO Score */}
          <div className={`border rounded-lg p-4 ${scoreColor(seoResult.score)}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-lg">SEO Score: {seoResult.score}/10</span>
              <span className="text-sm font-medium">
                {seoResult.score >= 8 ? 'Goed' : seoResult.score >= 5 ? 'Matig' : 'Zwak'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {seoResult.checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={check.passed ? 'text-green-600' : 'text-red-500'}>
                    {checkIcon(check.passed)}
                  </span>
                  <span className={check.passed ? 'text-slate-600' : 'text-slate-800 font-medium'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

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
          <div>
            <label className={labelClass}>Target keywords</label>
            <input
              type="text"
              value={targetKeywordsStr}
              onChange={(e) => setTargetKeywordsStr(e.target.value)}
              className={inputClass}
              placeholder="Kommagescheiden: wakeboard, kabelpark, watersporten"
            />
            <p className="text-xs text-slate-400 mt-1">
              Aanvullende zoekwoorden, gescheiden door komma&apos;s
            </p>
          </div>
        </div>
      </div>

      {/* Tab: FAQ */}
      <div className={activeTab === 'faq' ? 'block' : 'hidden'}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              FAQ-items worden als schema markup toegevoegd en verbeteren je vindbaarheid in zoekmachines en LLMs.
            </p>
            <button
              type="button"
              onClick={addFaqItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Vraag toevoegen
            </button>
          </div>

          {form.faq_items.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nog geen FAQ-items. Klik op &quot;Vraag toevoegen&quot; of genereer ze via AI.
            </div>
          )}

          {form.faq_items.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-slate-300 mt-3 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Vraag {index + 1}
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      className={inputClass}
                      placeholder="Veelgestelde vraag..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Antwoord
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      rows={2}
                      className={inputClass}
                      placeholder="Bondig maar volledig antwoord..."
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFaqItem(index)}
                  className="text-red-400 hover:text-red-600 mt-3 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
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
              Beschrijf het onderwerp en de AI genereert een volledig artikel met SEO-optimalisatie, FAQ en target keywords.
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
