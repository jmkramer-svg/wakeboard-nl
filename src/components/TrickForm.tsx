'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Trick,
  TrickCategory,
  TrickDirection,
  TrickTypeOption,
  TrickPrerequisites,
  TrickEquipment,
  TrickSteps,
  TrickStepPhase,
  TrickMistake,
  TrickExercise,
  TrickSafety,
  TrickVariation,
} from '@/types'
import { slugify } from '@/lib/utils'
import {
  Save, Eye, Trash2, Sparkles, X, Plus, ChevronDown, ChevronRight,
  Loader2, Check, AlertTriangle, Dumbbell, Settings, ListOrdered,
  Shield, Zap,
} from 'lucide-react'
import ImageUploader from './ImageUploader'

type TrickFormData = Omit<Trick, 'id' | 'created_at' | 'updated_at'>

interface TrickFormProps {
  trick?: Trick
}

const emptyPrerequisites: TrickPrerequisites = { tricks: [], physical: [], mental: [] }
const emptyEquipment: TrickEquipment = {}
const emptyPhase: TrickStepPhase = {}
const emptySteps: TrickSteps = { approach: { ...emptyPhase }, takeoff: { ...emptyPhase }, air: { ...emptyPhase }, landing: { ...emptyPhase } }
const emptySafety: TrickSafety = { injury_risks: [], safe_falling: '', when_to_stop: '' }

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
  category: null,
  difficulty_level: 1,
  direction: 'regular',
  trick_type: 'both',
  prerequisites: emptyPrerequisites,
  equipment: emptyEquipment,
  steps: emptySteps,
  common_mistakes: [],
  exercise_progression: [],
  safety: emptySafety,
  variations: [],
}

const CATEGORIES: { value: TrickCategory; label: string }[] = [
  { value: 'surface', label: 'Surface' },
  { value: 'ollie', label: 'Ollie' },
  { value: 'invert', label: 'Invert' },
  { value: 'grab', label: 'Grab' },
  { value: 'rail', label: 'Rail' },
  { value: 'switch', label: 'Switch' },
]

const DIFFICULTY_LABELS = ['Beginner', 'Makkelijk', 'Gemiddeld', 'Moeilijk', 'Expert']

function initFormFromTrick(trick: Trick): TrickFormData {
  return {
    title: trick.title,
    slug: trick.slug,
    description: trick.description,
    difficulty: trick.difficulty,
    image_url: trick.image_url,
    video_url: trick.video_url,
    is_current: trick.is_current,
    is_published: trick.is_published,
    published_at: trick.published_at,
    category: trick.category ?? null,
    difficulty_level: trick.difficulty_level ?? 1,
    direction: trick.direction ?? 'regular',
    trick_type: trick.trick_type ?? 'both',
    prerequisites: trick.prerequisites ?? emptyPrerequisites,
    equipment: trick.equipment ?? emptyEquipment,
    steps: trick.steps ?? emptySteps,
    common_mistakes: trick.common_mistakes ?? [],
    exercise_progression: trick.exercise_progression ?? [],
    safety: trick.safety ?? emptySafety,
    variations: trick.variations ?? [],
  }
}

export default function TrickForm({ trick }: TrickFormProps) {
  const router = useRouter()
  const isEdit = !!trick

  const [form, setForm] = useState<TrickFormData>(trick ? initFormFromTrick(trick) : defaultValues)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // AI state
  const [showAI, setShowAI] = useState(false)
  const [aiName, setAiName] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiStep, setAiStep] = useState<'idle' | 'generating' | 'done'>('idle')

  // Accordion state
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['basis']))

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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

  // --- Dynamic list helpers ---
  function addMistake() {
    setForm((prev) => ({ ...prev, common_mistakes: [...prev.common_mistakes, { mistake: '', explanation: '' }] }))
  }
  function updateMistake(i: number, field: keyof TrickMistake, value: string) {
    setForm((prev) => {
      const items = [...prev.common_mistakes]
      items[i] = { ...items[i], [field]: value }
      return { ...prev, common_mistakes: items }
    })
  }
  function removeMistake(i: number) {
    setForm((prev) => ({ ...prev, common_mistakes: prev.common_mistakes.filter((_, idx) => idx !== i) }))
  }

  function addExercise() {
    setForm((prev) => ({ ...prev, exercise_progression: [...prev.exercise_progression, { title: '', description: '' }] }))
  }
  function updateExercise(i: number, field: keyof TrickExercise, value: string) {
    setForm((prev) => {
      const items = [...prev.exercise_progression]
      items[i] = { ...items[i], [field]: value }
      return { ...prev, exercise_progression: items }
    })
  }
  function removeExercise(i: number) {
    setForm((prev) => ({ ...prev, exercise_progression: prev.exercise_progression.filter((_, idx) => idx !== i) }))
  }

  function addVariation() {
    setForm((prev) => ({ ...prev, variations: [...prev.variations, { name: '', description: '' }] }))
  }
  function updateVariation(i: number, field: keyof TrickVariation, value: string) {
    setForm((prev) => {
      const items = [...prev.variations]
      items[i] = { ...items[i], [field]: value }
      return { ...prev, variations: items }
    })
  }
  function removeVariation(i: number) {
    setForm((prev) => ({ ...prev, variations: prev.variations.filter((_, idx) => idx !== i) }))
  }

  // Prerequisites helpers
  function setPrereqField(field: keyof TrickPrerequisites, value: string) {
    setForm((prev) => ({
      ...prev,
      prerequisites: { ...prev.prerequisites, [field]: value.split(',').map((s) => s.trim()).filter(Boolean) },
    }))
  }

  // Equipment helpers
  function setEquipField(field: keyof TrickEquipment, value: string) {
    setForm((prev) => ({
      ...prev,
      equipment: { ...prev.equipment, [field]: value },
    }))
  }

  // Steps helpers
  function setStepPhase(phase: keyof TrickSteps, field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        [phase]: { ...prev.steps[phase], [field]: value },
      },
    }))
  }

  // Safety helpers
  function setSafetyField(field: 'safe_falling' | 'when_to_stop', value: string) {
    setForm((prev) => ({
      ...prev,
      safety: { ...prev.safety, [field]: value },
    }))
  }
  function setSafetyRisks(value: string) {
    setForm((prev) => ({
      ...prev,
      safety: { ...prev.safety, injury_risks: value.split(',').map((s) => s.trim()).filter(Boolean) },
    }))
  }

  // --- AI Generation ---
  async function handleGenerate() {
    if (!aiName.trim()) return
    setAiLoading(true)
    setAiError('')
    setAiStep('generating')

    try {
      const res = await fetch('/api/admin/generate-trick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trickName: aiName }),
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
      }

      // Parse JSON response
      const jsonStr = fullText.replace(/^[^{]*/, '').replace(/[^}]*$/, '')
      const data = JSON.parse(jsonStr)

      // Map difficulty_level to old difficulty field
      const diffMap: Record<number, string> = { 1: 'beginner', 2: 'beginner', 3: 'intermediate', 4: 'gevorderd', 5: 'gevorderd' }

      setForm((prev) => ({
        ...prev,
        title: isEdit ? prev.title : aiName,
        slug: isEdit ? prev.slug : slugify(aiName),
        description: data.description ?? prev.description,
        difficulty: diffMap[data.difficulty_level] ?? prev.difficulty,
        category: data.category ?? prev.category,
        difficulty_level: data.difficulty_level ?? prev.difficulty_level,
        direction: data.direction ?? prev.direction,
        trick_type: data.trick_type ?? prev.trick_type,
        prerequisites: data.prerequisites ?? prev.prerequisites,
        equipment: data.equipment ?? prev.equipment,
        steps: data.steps ?? prev.steps,
        common_mistakes: Array.isArray(data.common_mistakes) ? data.common_mistakes : prev.common_mistakes,
        exercise_progression: Array.isArray(data.exercise_progression) ? data.exercise_progression : prev.exercise_progression,
        safety: data.safety ?? prev.safety,
        variations: Array.isArray(data.variations) ? data.variations : prev.variations,
      }))

      // Open all sections to show results
      setOpenSections(new Set(['basis', 'voorwaarden', 'benodigdheden', 'stappen', 'fouten', 'progressie', 'veiligheid', 'variaties']))

      setAiStep('done')
      setTimeout(() => {
        setShowAI(false)
        setAiName('')
        setAiStep('idle')
      }, 1500)
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : 'Onbekende fout bij het parsen van AI-respons')
      setAiStep('idle')
    } finally {
      setAiLoading(false)
    }
  }

  // --- Save ---
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
  const sectionHeaderClass = 'flex items-center justify-between w-full p-4 text-left hover:bg-slate-50 transition-colors rounded-lg'

  function SectionHeader({ id, icon, title, count }: { id: string; icon: React.ReactNode; title: string; count?: number }) {
    const isOpen = openSections.has(id)
    return (
      <button type="button" onClick={() => toggleSection(id)} className={sectionHeaderClass}>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">{icon}</span>
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          {count !== undefined && count > 0 && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
    )
  }

  return (
    <div className="max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* AI Generate Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowAI(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
        >
          <Sparkles className="w-4 h-4" />
          Genereer met AI
        </button>
      </div>

      {/* === TOP FIELDS === */}
      <div className="space-y-5 mb-6">
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
          <label className={labelClass}>Beschrijving *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Korte beschrijving van de trick..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) => set('is_current', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Trick van de week</span>
          </label>
        </div>
      </div>

      {/* === ACCORDION SECTIONS === */}
      <div className="space-y-2">
        {/* 1. Basisinformatie */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="basis" icon={<Settings className="w-4 h-4" />} title="Basisinformatie" />
          {openSections.has('basis') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Categorie</label>
                  <select
                    value={form.category ?? ''}
                    onChange={(e) => set('category', (e.target.value || null) as TrickCategory | null)}
                    className={inputClass}
                  >
                    <option value="">Selecteer...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Moeilijkheidsgraad (1-5)</label>
                  <select
                    value={form.difficulty_level}
                    onChange={(e) => set('difficulty_level', Number(e.target.value))}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} — {DIFFICULTY_LABELS[n - 1]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Richting</label>
                  <select
                    value={form.direction}
                    onChange={(e) => set('direction', e.target.value as TrickDirection)}
                    className={inputClass}
                  >
                    <option value="regular">Regular</option>
                    <option value="switch">Switch</option>
                    <option value="both">Beide</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select
                    value={form.trick_type}
                    onChange={(e) => set('trick_type', e.target.value as TrickTypeOption)}
                    className={inputClass}
                  >
                    <option value="boot">Boot</option>
                    <option value="cable">Kabel</option>
                    <option value="both">Beide</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Voorwaarden */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="voorwaarden" icon={<Dumbbell className="w-4 h-4" />} title="Voorwaarden" count={form.prerequisites.tricks.length} />
          {openSections.has('voorwaarden') && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <label className={labelClass}>Vereiste tricks (kommagescheiden)</label>
                <input
                  type="text"
                  value={form.prerequisites.tricks.join(', ')}
                  onChange={(e) => setPrereqField('tricks', e.target.value)}
                  className={inputClass}
                  placeholder="bijv. Ollie, Surface 180"
                />
              </div>
              <div>
                <label className={labelClass}>Fysieke vaardigheden (kommagescheiden)</label>
                <input
                  type="text"
                  value={form.prerequisites.physical.join(', ')}
                  onChange={(e) => setPrereqField('physical', e.target.value)}
                  className={inputClass}
                  placeholder="bijv. Goede core-stabiliteit, Sterke benen"
                />
              </div>
              <div>
                <label className={labelClass}>Mentale vaardigheden (kommagescheiden)</label>
                <input
                  type="text"
                  value={form.prerequisites.mental.join(', ')}
                  onChange={(e) => setPrereqField('mental', e.target.value)}
                  className={inputClass}
                  placeholder="bijv. Durf om los te laten, Commitment"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Benodigdheden */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="benodigdheden" icon={<Settings className="w-4 h-4" />} title="Benodigdheden / Setup" />
          {openSections.has('benodigdheden') && (
            <div className="px-4 pb-4 space-y-4">
              {(['board_type', 'fins', 'protection', 'speed', 'line_length', 'obstacle_type'] as const).map((field) => (
                <div key={field}>
                  <label className={labelClass}>
                    {{ board_type: 'Board type', fins: 'Fins', protection: 'Bescherming', speed: 'Snelheid', line_length: 'Lijnlengte', obstacle_type: 'Obstakel type' }[field]}
                  </label>
                  <input
                    type="text"
                    value={form.equipment[field] ?? ''}
                    onChange={(e) => setEquipField(field, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Stap-voor-stap */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="stappen" icon={<ListOrdered className="w-4 h-4" />} title="Stap-voor-stap uitvoering" />
          {openSections.has('stappen') && (
            <div className="px-4 pb-4 space-y-6">
              {([
                { phase: 'approach' as const, label: 'A. Aanloop', fields: ['edge_type', 'speed_buildup', 'body_position'] },
                { phase: 'takeoff' as const, label: 'B. Afzet', fields: ['timing', 'weight_distribution', 'rotation'] },
                { phase: 'air' as const, label: 'C. Luchtfase', fields: ['focus_point', 'grab_timing', 'knee_position'] },
                { phase: 'landing' as const, label: 'D. Landing', fields: ['board_position', 'edge_choice', 'knee_absorption', 'ride_out'] },
              ]).map(({ phase, label, fields }) => (
                <div key={phase}>
                  <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">{label}</h4>
                  <div className="space-y-3">
                    {fields.map((field) => {
                      const fieldLabels: Record<string, string> = {
                        edge_type: 'Edge type', speed_buildup: 'Snelheidsopbouw', body_position: 'Lichaamspositie',
                        timing: 'Timing', weight_distribution: 'Gewichtsverdeling', rotation: 'Rotatie',
                        focus_point: 'Focuspunt', grab_timing: 'Grab timing', knee_position: 'Kniepositie',
                        board_position: 'Boardpositie', edge_choice: 'Edge keuze', knee_absorption: 'Knie-absorptie', ride_out: 'Doorrijden',
                      }
                      return (
                        <div key={field}>
                          <label className={labelClass}>{fieldLabels[field] ?? field}</label>
                          <input
                            type="text"
                            value={(form.steps[phase] as Record<string, string | undefined>)[field] ?? ''}
                            onChange={(e) => setStepPhase(phase, field, e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Veelgemaakte fouten */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="fouten" icon={<AlertTriangle className="w-4 h-4" />} title="Veelgemaakte fouten" count={form.common_mistakes.length} />
          {openSections.has('fouten') && (
            <div className="px-4 pb-4 space-y-3">
              {form.common_mistakes.map((item, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-slate-500">Fout {i + 1}</span>
                    <button type="button" onClick={() => removeMistake(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.mistake}
                    onChange={(e) => updateMistake(i, 'mistake', e.target.value)}
                    className={inputClass}
                    placeholder="Wat gaat er fout?"
                  />
                  <textarea
                    value={item.explanation}
                    onChange={(e) => updateMistake(i, 'explanation', e.target.value)}
                    rows={2}
                    className={inputClass}
                    placeholder="Uitleg en hoe te voorkomen..."
                  />
                </div>
              ))}
              <button type="button" onClick={addMistake} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
                <Plus className="w-4 h-4" /> Fout toevoegen
              </button>
            </div>
          )}
        </div>

        {/* 6. Oefenprogressie */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="progressie" icon={<Zap className="w-4 h-4" />} title="Oefenprogressie" count={form.exercise_progression.length} />
          {openSections.has('progressie') && (
            <div className="px-4 pb-4 space-y-3">
              {form.exercise_progression.map((item, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-slate-500">Stap {i + 1}</span>
                    <button type="button" onClick={() => removeExercise(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateExercise(i, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Naam van de oefenstap"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateExercise(i, 'description', e.target.value)}
                    rows={2}
                    className={inputClass}
                    placeholder="Beschrijving..."
                  />
                </div>
              ))}
              <button type="button" onClick={addExercise} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
                <Plus className="w-4 h-4" /> Oefenstap toevoegen
              </button>
            </div>
          )}
        </div>

        {/* 7. Veiligheid */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="veiligheid" icon={<Shield className="w-4 h-4" />} title="Veiligheid & Risico's" />
          {openSections.has('veiligheid') && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <label className={labelClass}>Blessurerisico&apos;s (kommagescheiden)</label>
                <input
                  type="text"
                  value={form.safety.injury_risks.join(', ')}
                  onChange={(e) => setSafetyRisks(e.target.value)}
                  className={inputClass}
                  placeholder="bijv. Schouder blessure, Whiplash"
                />
              </div>
              <div>
                <label className={labelClass}>Veilig vallen</label>
                <textarea
                  value={form.safety.safe_falling}
                  onChange={(e) => setSafetyField('safe_falling', e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Hoe veilig te vallen bij deze trick..."
                />
              </div>
              <div>
                <label className={labelClass}>Wanneer stoppen</label>
                <textarea
                  value={form.safety.when_to_stop}
                  onChange={(e) => setSafetyField('when_to_stop', e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Wanneer je moet stoppen met oefenen..."
                />
              </div>
            </div>
          )}
        </div>

        {/* 8. Variaties */}
        <div className="border border-slate-200 rounded-lg">
          <SectionHeader id="variaties" icon={<Zap className="w-4 h-4" />} title="Variaties & Next Level" count={form.variations.length} />
          {openSections.has('variaties') && (
            <div className="px-4 pb-4 space-y-3">
              {form.variations.map((item, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-slate-500">Variatie {i + 1}</span>
                    <button type="button" onClick={() => removeVariation(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateVariation(i, 'name', e.target.value)}
                    className={inputClass}
                    placeholder="Naam van de variatie"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateVariation(i, 'description', e.target.value)}
                    rows={2}
                    className={inputClass}
                    placeholder="Wat is anders..."
                  />
                </div>
              ))}
              <button type="button" onClick={addVariation} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
                <Plus className="w-4 h-4" /> Variatie toevoegen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === ACTIONS === */}
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

      {/* === AI MODAL === */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Trick Generator
              </h3>
              {!aiLoading && aiStep !== 'done' && (
                <button type="button" onClick={() => { setShowAI(false); setAiError(''); setAiStep('idle') }}>
                  <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {aiStep === 'idle' && !aiLoading && (
              <>
                <p className="text-sm text-slate-500 mb-4">
                  Voer de naam van de trick in en de AI genereert alle details: stappen, fouten, oefenprogressie en meer.
                </p>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                  placeholder="bijv. Raley, Tantrum, Backroll..."
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                {aiError && <p className="text-sm text-red-600 mb-3">{aiError}</p>}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!aiName.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Trick genereren
                </button>
              </>
            )}

            {(aiStep === 'generating' || aiStep === 'done') && (
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-3">
                  {aiStep === 'generating' ? (
                    <Loader2 className="w-5 h-5 text-purple-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  )}
                  <span className={`text-sm ${aiStep === 'generating' ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    Trick-data genereren...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {aiStep === 'done' ? (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />
                  )}
                  <span className={`text-sm ${aiStep === 'done' ? 'text-green-700 font-medium' : 'text-slate-400'}`}>
                    Klaar!
                  </span>
                </div>
                {aiStep === 'done' && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    Trick succesvol gegenereerd! Alle velden zijn ingevuld.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
