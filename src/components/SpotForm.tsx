'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Spot } from '@/types'
import { PROVINCES, TYPE_LABELS, DIFFICULTY_LABELS, slugify } from '@/lib/utils'
import { Save, Trash2, Eye, Plus, X, FileSpreadsheet } from 'lucide-react'
import ImageUploader from './ImageUploader'
import CoordPickerWrapper from './CoordPickerWrapper'
import ExcelImport from './ExcelImport'

type SpotFormData = Omit<Spot, 'id' | 'created_at' | 'updated_at'>

interface SpotFormProps {
  spot?: Spot
}

const defaultValues: SpotFormData = {
  name: '',
  slug: '',
  description: '',
  province: 'Noord-Holland',
  city: '',
  address: '',
  latitude: 52.3,
  longitude: 5.3,
  type: 'kabel',
  difficulty: 'alle niveaus',
  website: '',
  phone: '',
  email: '',
  image_url: '',
  features: [],
  obstacles: [],
  price_info: '',
  opening_hours: '',
  is_published: false,
}

const COMMON_FEATURES = [
  'Verhuur', 'Lessen', 'Horeca', 'Parkeren', 'Kleedkamers',
  'Douches', 'Verlichting', 'Beginnersbaan', 'Tricks baan', 'Camping',
]

export default function SpotForm({ spot }: SpotFormProps) {
  const router = useRouter()
  const isEdit = !!spot

  const [form, setForm] = useState<SpotFormData>(
    spot
      ? {
          name: spot.name,
          slug: spot.slug,
          description: spot.description,
          province: spot.province,
          city: spot.city,
          address: spot.address ?? '',
          latitude: spot.latitude,
          longitude: spot.longitude,
          type: spot.type,
          difficulty: spot.difficulty,
          website: spot.website ?? '',
          phone: spot.phone ?? '',
          email: spot.email ?? '',
          image_url: spot.image_url ?? '',
          features: spot.features ?? [],
          obstacles: spot.obstacles ?? [],
          price_info: spot.price_info ?? '',
          opening_hours: spot.opening_hours ?? '',
          is_published: spot.is_published,
        }
      : defaultValues
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [obstacleInput, setObstacleInput] = useState('')
  const [showImport, setShowImport] = useState(false)

  function set<K extends keyof SpotFormData>(key: K, value: SpotFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: isEdit ? prev.slug : slugify(value),
    }))
  }

  function toggleFeature(feature: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  function addObstacle() {
    const val = obstacleInput.trim()
    if (!val || form.obstacles.includes(val)) return
    setForm((prev) => ({ ...prev, obstacles: [...prev.obstacles, val] }))
    setObstacleInput('')
  }

  function removeObstacle(ob: string) {
    setForm((prev) => ({ ...prev, obstacles: prev.obstacles.filter((o) => o !== ob) }))
  }

  async function handleSave(publish?: boolean) {
    setSaving(true)
    setError('')
    const supabase = createClient()

    const payload = {
      ...form,
      is_published: publish !== undefined ? publish : form.is_published,
      address: form.address || null,
      website: form.website || null,
      phone: form.phone || null,
      email: form.email || null,
      image_url: form.image_url || null,
      price_info: form.price_info || null,
      opening_hours: form.opening_hours || null,
      updated_at: new Date().toISOString(),
    }

    let err
    if (isEdit) {
      const { error } = await supabase.from('spots').update(payload).eq('id', spot!.id)
      err = error
    } else {
      const { error } = await supabase.from('spots').insert({ ...payload, created_at: new Date().toISOString() })
      err = error
    }

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push('/admin/spots')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${form.name}" wilt verwijderen?`)) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('spots').delete().eq('id', spot!.id)
    router.push('/admin/spots')
    router.refresh()
  }

  const inputClass =
    'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  return (
    <div className="max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basisinfo */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Basisinformatie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Naam *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className={inputClass}
                placeholder="Naam van het wakeboardspot"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className={inputClass}
                placeholder="auto-gegenereerd-uit-naam"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Beschrijving *</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                required
                className={inputClass}
                placeholder="Beschrijf dit wakeboardspot..."
              />
            </div>
            <div>
              <label className={labelClass}>Type *</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value as Spot['type'])} className={inputClass}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Niveau *</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Spot['difficulty'])} className={inputClass}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Locatie */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Locatie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Provincie *</label>
              <select value={form.province} onChange={(e) => set('province', e.target.value as Spot['province'])} className={inputClass}>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Stad / Gemeente *</label>
              <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputClass} placeholder="Amsterdam" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Adres</label>
              <input type="text" value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} className={inputClass} placeholder="Straatnaam 1, 1234AB Stad" />
            </div>
            <div>
              <label className={labelClass}>Breedtegraad *</label>
              <input
                type="number" step="any" value={form.latitude}
                onChange={(e) => set('latitude', parseFloat(e.target.value))}
                className={inputClass} placeholder="52.3702"
              />
            </div>
            <div>
              <label className={labelClass}>Lengtegraad *</label>
              <input
                type="number" step="any" value={form.longitude}
                onChange={(e) => set('longitude', parseFloat(e.target.value))}
                className={inputClass} placeholder="4.8952"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Locatie op kaart instellen</label>
              <CoordPickerWrapper
                lat={form.latitude}
                lng={form.longitude}
                onChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Contact & openingstijden</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Website</label>
              <input type="url" value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} className={inputClass} placeholder="https://voorbeeld.nl" />
            </div>
            <div>
              <label className={labelClass}>Telefoonnummer</label>
              <input type="tel" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} className={inputClass} placeholder="+31 6 12345678" />
            </div>
            <div>
              <label className={labelClass}>E-mailadres</label>
              <input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} className={inputClass} placeholder="info@spot.nl" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Openingstijden</label>
              <textarea value={form.opening_hours ?? ''} onChange={(e) => set('opening_hours', e.target.value)} rows={3} className={inputClass} placeholder="Ma-vr: 10:00-20:00&#10;Za-zo: 09:00-21:00" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Prijsinformatie</label>
              <input type="text" value={form.price_info ?? ''} onChange={(e) => set('price_info', e.target.value)} className={inputClass} placeholder="Dagkaart €25 | Seizoenskaart €200" />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Media</h2>
          <label className={labelClass}>Afbeelding</label>
          <ImageUploader
            value={form.image_url ?? ''}
            onChange={(url) => set('image_url', url)}
            bucket="spot-images"
          />
        </section>

        {/* Faciliteiten */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Faciliteiten</h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_FEATURES.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  form.features.includes(feature)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </section>

        {/* Obstakels */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Obstakels</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={obstacleInput}
              onChange={(e) => setObstacleInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addObstacle() } }}
              className={inputClass + ' flex-1'}
              placeholder="Rail, kicker, slider... (Enter om toe te voegen)"
            />
            <button
              type="button"
              onClick={addObstacle}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.obstacles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.obstacles.map((ob) => (
                <span
                  key={ob}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {ob}
                  <button type="button" onClick={() => removeObstacle(ob)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Excel import */}
        {!isEdit && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <button
              type="button"
              onClick={() => setShowImport(!showImport)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {showImport ? 'Excel import verbergen' : 'Meerdere spots importeren via Excel'}
            </button>
            {showImport && (
              <div className="mt-4">
                <ExcelImport />
              </div>
            )}
          </section>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
        <div className="flex gap-3">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Opslaan als concept'}
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
