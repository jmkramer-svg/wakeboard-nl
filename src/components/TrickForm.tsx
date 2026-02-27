'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trick } from '@/types'
import { slugify } from '@/lib/utils'
import { Save, Eye, Trash2 } from 'lucide-react'
import ImageUploader from './ImageUploader'

type TrickFormData = Omit<Trick, 'id' | 'created_at' | 'updated_at'>

interface TrickFormProps {
  trick?: Trick
}

const defaultValues: TrickFormData = {
  title: '',
  slug: '',
  description: '',
  difficulty: 'beginner',
  image_url: null,
  video_url: null,
  is_current: false,
  is_published: false,
  published_at: null,
}

export default function TrickForm({ trick }: TrickFormProps) {
  const router = useRouter()
  const isEdit = !!trick

  const [form, setForm] = useState<TrickFormData>(
    trick
      ? {
          title: trick.title,
          slug: trick.slug,
          description: trick.description,
          difficulty: trick.difficulty,
          image_url: trick.image_url,
          video_url: trick.video_url,
          is_current: trick.is_current,
          is_published: trick.is_published,
          published_at: trick.published_at,
        }
      : defaultValues
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof TrickFormData>(key: K, value: TrickFormData[K]) {
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
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      is_published: shouldPublish,
      published_at: shouldPublish && !form.published_at ? now : form.published_at,
      updated_at: now,
    }

    let err
    if (isEdit) {
      const { error } = await supabase.from('tricks').update(payload).eq('id', trick!.id)
      err = error
    } else {
      const { error } = await supabase.from('tricks').insert({ ...payload, created_at: now })
      err = error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    router.push('/admin/tricks')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${form.title}" wilt verwijderen?`)) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('tricks').delete().eq('id', trick!.id)
    router.push('/admin/tricks')
    router.refresh()
  }

  const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Titel *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={inputClass}
            placeholder="bijv. Raley"
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
          <label className={labelClass}>Moeilijkheidsgraad</label>
          <select
            value={form.difficulty}
            onChange={(e) => set('difficulty', e.target.value)}
            className={inputClass}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="gevorderd">Gevorderd</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Beschrijving *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={5}
            className={inputClass}
            placeholder="Uitleg over de trick, tips voor uitvoering..."
          />
        </div>

        <div>
          <label className={labelClass}>Afbeelding</label>
          <ImageUploader
            value={form.image_url ?? ''}
            onChange={(url) => set('image_url', url || null)}
            bucket="article-images"
          />
        </div>

        <div>
          <label className={labelClass}>Video URL</label>
          <input
            type="url"
            value={form.video_url ?? ''}
            onChange={(e) => set('video_url', e.target.value || null)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-slate-400 mt-1">YouTube, Vimeo of ander video platform</p>
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) => set('is_current', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Trick van de week</span>
          </label>
          <p className="text-xs text-slate-400">Als dit aangevinkt is, verschijnt deze trick op de homepage</p>
        </div>
      </div>

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
    </div>
  )
}
