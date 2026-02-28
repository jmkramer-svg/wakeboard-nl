import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Trick, TrickCategory, TrickTypeOption,
  TrickMistake, TrickExercise, TrickVariation,
} from '@/types'
import {
  ArrowLeft, Star, AlertTriangle, Shield, Zap,
  ListOrdered, Dumbbell, Settings, Cable, Ship, Layers, Play,
} from 'lucide-react'
import type { Metadata } from 'next'

const CATEGORY_LABELS: Record<TrickCategory, string> = {
  surface: 'Surface', ollie: 'Ollie', invert: 'Invert',
  grab: 'Grab', rail: 'Rail', switch: 'Switch',
}

const CATEGORY_COLORS: Record<TrickCategory, string> = {
  surface: 'bg-blue-100 text-blue-700', ollie: 'bg-green-100 text-green-700',
  invert: 'bg-purple-100 text-purple-700', grab: 'bg-amber-100 text-amber-700',
  rail: 'bg-red-100 text-red-700', switch: 'bg-cyan-100 text-cyan-700',
}

const DIFFICULTY_LABELS = ['Beginner', 'Makkelijk', 'Gemiddeld', 'Moeilijk', 'Expert']

const TYPE_LABELS: Record<TrickTypeOption, string> = { cable: 'Kabel', boot: 'Boot', both: 'Kabel & Boot' }
const TYPE_ICONS: Record<TrickTypeOption, React.ReactNode> = {
  cable: <Cable className="w-4 h-4" />, boot: <Ship className="w-4 h-4" />, both: <Layers className="w-4 h-4" />,
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('tricks')
    .select('title, description, category, image_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) {
    return { title: 'Trick niet gevonden — Wakeboard NL' }
  }

  const title = `${data.title} — Wakeboard Trick Uitleg | Wakeboard NL`
  const description = data.description || `Leer de ${data.title} met onze stap-voor-stap uitleg. Tips, fouten en oefenprogressie.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: data.image_url ? [data.image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: { canonical: `/trickgids/${slug}` },
  }
}

export default async function TrickDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('tricks')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) notFound()
  const trick = data as Trick

  const hasPrerequisites = trick.prerequisites &&
    (trick.prerequisites.tricks?.length > 0 || trick.prerequisites.physical?.length > 0 || trick.prerequisites.mental?.length > 0)

  const hasEquipment = trick.equipment &&
    Object.values(trick.equipment).some((v) => v && String(v).trim())

  const hasSteps = trick.steps &&
    Object.values(trick.steps).some((phase) =>
      phase && Object.values(phase).some((v) => v && String(v).trim())
    )

  const hasMistakes = trick.common_mistakes?.length > 0
  const hasExercises = trick.exercise_progression?.length > 0
  const hasSafety = trick.safety &&
    (trick.safety.injury_risks?.length > 0 || trick.safety.safe_falling || trick.safety.when_to_stop)
  const hasVariations = trick.variations?.length > 0

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: trick.title,
    description: trick.description,
    step: trick.steps ? [
      trick.steps.approach && Object.values(trick.steps.approach).some(Boolean) && {
        '@type': 'HowToStep',
        name: 'Aanloop',
        text: Object.values(trick.steps.approach).filter(Boolean).join('. '),
      },
      trick.steps.takeoff && Object.values(trick.steps.takeoff).some(Boolean) && {
        '@type': 'HowToStep',
        name: 'Afzet',
        text: Object.values(trick.steps.takeoff).filter(Boolean).join('. '),
      },
      trick.steps.air && Object.values(trick.steps.air).some(Boolean) && {
        '@type': 'HowToStep',
        name: 'Luchtfase',
        text: Object.values(trick.steps.air).filter(Boolean).join('. '),
      },
      trick.steps.landing && Object.values(trick.steps.landing).some(Boolean) && {
        '@type': 'HowToStep',
        name: 'Landing',
        text: Object.values(trick.steps.landing).filter(Boolean).join('. '),
      },
    ].filter(Boolean) : [],
    image: trick.image_url ?? undefined,
  }

  const equipmentLabels: Record<string, string> = {
    board_type: 'Board type', fins: 'Fins', protection: 'Bescherming',
    speed: 'Snelheid', line_length: 'Lijnlengte', obstacle_type: 'Obstakel',
  }

  const phaseData = [
    { key: 'approach', label: 'A. Aanloop', icon: '🏃', fields: { edge_type: 'Edge', speed_buildup: 'Snelheid', body_position: 'Lichaamspositie' } },
    { key: 'takeoff', label: 'B. Afzet', icon: '🚀', fields: { timing: 'Timing', weight_distribution: 'Gewicht', rotation: 'Rotatie' } },
    { key: 'air', label: 'C. Luchtfase', icon: '✈️', fields: { focus_point: 'Focus', grab_timing: 'Grab', knee_position: 'Knieën' } },
    { key: 'landing', label: 'D. Landing', icon: '🎯', fields: { board_position: 'Board', edge_choice: 'Edge', knee_absorption: 'Absorptie', ride_out: 'Doorrijden' } },
  ] as const

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#050e1a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071d31] via-[#050e1a] to-[#030b15]" />
        <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-5 py-16 sm:py-20">
          <Link href="/trickgids" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {trick.category && (
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${CATEGORY_COLORS[trick.category]}`}>
                {CATEGORY_LABELS[trick.category]}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              {TYPE_ICONS[trick.trick_type]}
              {TYPE_LABELS[trick.trick_type]}
            </span>
            <span className="text-sm text-white/50 capitalize">{trick.direction}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.92] mb-4">
            {trick.title}
          </h1>

          {/* Difficulty stars */}
          <div className="flex items-center gap-1.5 mb-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-5 h-5 ${n <= (trick.difficulty_level ?? 1) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
              />
            ))}
            <span className="text-sm text-white/50 ml-2">
              {DIFFICULTY_LABELS[(trick.difficulty_level ?? 1) - 1]}
            </span>
          </div>

          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl">
            {trick.description}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* VIDEO */}
      {trick.video_url && (
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-5 -mt-4">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-slate-900">
              {getYouTubeEmbedUrl(trick.video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(trick.video_url)!}
                  title={trick.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <a href={trick.video_url} target="_blank" rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT SECTIONS */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-5 py-12 sm:py-16 space-y-8">

          {/* Voorwaarden */}
          {hasPrerequisites && (
            <SectionCard icon={<Dumbbell className="w-5 h-5" />} title="Voorwaarden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {trick.prerequisites.tricks?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Vereiste tricks</h4>
                    <ul className="space-y-1">
                      {trick.prerequisites.tricks.map((t, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-cyan-500 mt-0.5">&#8226;</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {trick.prerequisites.physical?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Fysiek</h4>
                    <ul className="space-y-1">
                      {trick.prerequisites.physical.map((p, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">&#8226;</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {trick.prerequisites.mental?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Mentaal</h4>
                    <ul className="space-y-1">
                      {trick.prerequisites.mental.map((m, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">&#8226;</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Benodigdheden */}
          {hasEquipment && (
            <SectionCard icon={<Settings className="w-5 h-5" />} title="Benodigdheden & Setup">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(trick.equipment).map(([key, value]) => {
                  if (!value || !String(value).trim()) return null
                  return (
                    <div key={key} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Settings className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {equipmentLabels[key] ?? key}
                        </p>
                        <p className="text-sm text-slate-700">{String(value)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          )}

          {/* Stap-voor-stap */}
          {hasSteps && (
            <SectionCard icon={<ListOrdered className="w-5 h-5" />} title="Stap-voor-stap uitvoering">
              <div className="space-y-6">
                {phaseData.map(({ key, label, icon, fields }) => {
                  const phase = trick.steps[key]
                  if (!phase || !Object.values(phase).some((v) => v && String(v).trim())) return null
                  return (
                    <div key={key} className="relative pl-8 border-l-2 border-cyan-200">
                      <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-cyan-50 border-2 border-cyan-200 flex items-center justify-center text-sm">
                        {icon}
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-3">{label}</h4>
                      <div className="space-y-2">
                        {Object.entries(fields).map(([fieldKey, fieldLabel]) => {
                          const val = (phase as Record<string, string | undefined>)[fieldKey]
                          if (!val?.trim()) return null
                          return (
                            <div key={fieldKey} className="flex items-start gap-2">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[80px] mt-0.5">
                                {fieldLabel}
                              </span>
                              <span className="text-sm text-slate-700">{val}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          )}

          {/* Veelgemaakte fouten */}
          {hasMistakes && (
            <SectionCard icon={<AlertTriangle className="w-5 h-5" />} title="Veelgemaakte fouten">
              <div className="space-y-4">
                {trick.common_mistakes.map((item: TrickMistake, i: number) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-amber-900 text-sm">{item.mistake}</p>
                        <p className="text-sm text-amber-800/80 mt-1">{item.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Oefenprogressie */}
          {hasExercises && (
            <SectionCard icon={<Zap className="w-5 h-5" />} title="Oefenprogressie">
              <div className="space-y-4">
                {trick.exercise_progression.map((item: TrickExercise, i: number) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    {i < trick.exercise_progression.length - 1 && (
                      <div className="absolute left-[13px] top-8 bottom-0 w-0.5 bg-cyan-200" />
                    )}
                    <div className="pb-4">
                      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Veiligheid */}
          {hasSafety && (
            <SectionCard icon={<Shield className="w-5 h-5" />} title="Veiligheid & Risico's" variant="red">
              <div className="space-y-4">
                {trick.safety.injury_risks?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-red-800 mb-2">Blessurerisico&apos;s</h4>
                    <div className="flex flex-wrap gap-2">
                      {trick.safety.injury_risks.map((risk, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {trick.safety.safe_falling && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-1">Veilig vallen</h4>
                    <p className="text-sm text-slate-600">{trick.safety.safe_falling}</p>
                  </div>
                )}
                {trick.safety.when_to_stop && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-1">Wanneer stoppen</h4>
                    <p className="text-sm text-slate-600">{trick.safety.when_to_stop}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Variaties */}
          {hasVariations && (
            <SectionCard icon={<Zap className="w-5 h-5" />} title="Variaties & Next Level">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trick.variations.map((item: TrickVariation, i: number) => (
                  <div key={i} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4">
                    <p className="font-semibold text-slate-800 text-sm mb-1">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Back link */}
          <div className="pt-8 border-t border-slate-100">
            <Link href="/trickgids" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionCard({
  icon,
  title,
  children,
  variant = 'default',
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  variant?: 'default' | 'red'
}) {
  const borderColor = variant === 'red' ? 'border-red-200' : 'border-slate-200'
  const headerBg = variant === 'red' ? 'bg-red-50' : 'bg-slate-50'
  const iconColor = variant === 'red' ? 'text-red-500' : 'text-cyan-600'

  return (
    <div className={`border ${borderColor} rounded-2xl overflow-hidden`}>
      <div className={`${headerBg} px-6 py-4 flex items-center gap-3 border-b ${borderColor}`}>
        <span className={iconColor}>{icon}</span>
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  )
}
