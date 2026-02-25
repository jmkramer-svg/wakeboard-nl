import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SpotMapWrapper from '@/components/SpotMapWrapper'
import ReviewForm from '@/components/ReviewForm'
import { TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/utils'
import { MapPin, Globe, Phone, Mail, Clock, Euro, ChevronLeft, Waves, Star } from 'lucide-react'
import type { Metadata } from 'next'
import { Review } from '@/types'

interface SpotDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SpotDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: spot } = await supabase
    .from('spots')
    .select('name, description, city, province, image_url')
    .eq('slug', slug)
    .single()

  if (!spot) return {}

  const title = `${spot.name} — Wakeboard NL`
  const description = `Wakeboardspot ${spot.name} in ${spot.city}, ${spot.province}. ${spot.description}`

  return {
    title,
    description,
    openGraph: { title, description, images: spot.image_url ? [spot.image_url] : [] },
    twitter: { card: 'summary_large_image', title, description, images: spot.image_url ? [spot.image_url] : [] },
  }
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: spot }, { data: reviewsData }] = await Promise.all([
    supabase.from('spots').select('*').eq('slug', slug).eq('is_published', true).single(),
    supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false }),
  ])

  if (!spot) notFound()

  const reviews = ((reviewsData ?? []) as Review[]).filter((r) => r.spot_id === spot.id)
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl'

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Spots', item: `${siteUrl}/spots` },
      { '@type': 'ListItem', position: 3, name: spot.name, item: `${siteUrl}/spots/${spot.slug}` },
    ],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: spot.name,
    description: spot.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: spot.city,
      addressRegion: spot.province,
      addressCountry: 'NL',
      streetAddress: spot.address ?? undefined,
    },
    geo: { '@type': 'GeoCoordinates', latitude: spot.latitude, longitude: spot.longitude },
    url: `${siteUrl}/spots/${spot.slug}`,
    image: spot.image_url ?? undefined,
    telephone: spot.phone ?? undefined,
    email: spot.email ?? undefined,
    ...(spot.website ? { sameAs: [spot.website] } : {}),
    ...(avgRating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating.toFixed(1), reviewCount: reviews.length } } : {}),
  }

  const typeBadgeColors: Record<string, string> = {
    kabel: 'bg-blue-500',
    boot:  'bg-emerald-500',
    beide: 'bg-violet-500',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[50vh] sm:min-h-[60vh] flex items-end">
        {/* Background */}
        {spot.image_url ? (
          <img src={spot.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[#050e1a]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#071d31] via-[#050e1a] to-[#030b15]" />
            <div className="absolute -top-40 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Waves className="w-32 h-32 text-white/5" />
            </div>
          </>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-0 right-0 max-w-6xl mx-auto px-5">
          <Link
            href="/spots"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Terug naar locaties
          </Link>
        </div>

        {/* Spot info */}
        <div className="relative w-full max-w-6xl mx-auto px-5 pb-10 pt-20">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${typeBadgeColors[spot.type]}`}>
              {TYPE_LABELS[spot.type]}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white/80 border border-white/10">
              {DIFFICULTY_LABELS[spot.difficulty]}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow mb-3">
            {spot.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/55 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{spot.city}, {spot.province}</span>
            </div>
            {avgRating && (
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`}
                  />
                ))}
                <span className="text-white/50 text-sm ml-1">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ── CONTENT ── */}
      <div className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main */}
            <div className="lg:col-span-2 space-y-5">

              {/* Description */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 shadow-sm">
                <h2 className="font-black text-slate-900 text-lg mb-3">Over dit spot</h2>
                <p className="text-slate-600 leading-relaxed">{spot.description}</p>
              </div>

              {/* Features */}
              {spot.features?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 shadow-sm">
                  <h2 className="font-black text-slate-900 text-lg mb-4">Faciliteiten</h2>
                  <div className="flex flex-wrap gap-2">
                    {spot.features.map((feature: string) => (
                      <span key={feature} className="text-sm bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-full border border-cyan-100 font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Obstacles */}
              {spot.obstacles?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 shadow-sm">
                  <h2 className="font-black text-slate-900 text-lg mb-4">Obstakels</h2>
                  <div className="flex flex-wrap gap-2">
                    {spot.obstacles.map((ob: string) => (
                      <span key={ob} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium">
                        {ob}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 shadow-sm">
                <h2 className="font-black text-slate-900 text-lg mb-4">Locatie</h2>
                <div className="rounded-xl overflow-hidden">
                  <SpotMapWrapper
                    spots={[spot]}
                    center={[spot.latitude, spot.longitude]}
                    zoom={13}
                    height="300px"
                  />
                </div>
                {spot.address && (
                  <p className="text-sm text-slate-500 mt-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {spot.address}
                  </p>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-7 shadow-sm">
                <h2 className="font-black text-slate-900 text-lg mb-5">
                  Reviews{reviews.length > 0 && <span className="text-slate-400 font-normal text-base ml-2">({reviews.length})</span>}
                </h2>

                {reviews.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-slate-900 text-sm">{review.author_name}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(review.created_at).toLocaleDateString('nl-NL')}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{review.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="font-bold text-slate-800 mb-4">Schrijf een review</h3>
                <ReviewForm spotId={spot.id} />
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sticky top-24">
                <h3 className="font-black text-slate-900 text-lg mb-5">Contact & info</h3>
                <div className="space-y-3">
                  {spot.website && (
                    <a href={spot.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-cyan-600 hover:text-cyan-700 group">
                      <div className="w-9 h-9 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="truncate group-hover:underline">{spot.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                  {spot.phone && (
                    <a href={`tel:${spot.phone}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-slate-400" />
                      </div>
                      {spot.phone}
                    </a>
                  )}
                  {spot.email && (
                    <a href={`mailto:${spot.email}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      {spot.email}
                    </a>
                  )}
                  {spot.opening_hours && (
                    <div className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="whitespace-pre-line leading-relaxed">{spot.opening_hours}</span>
                    </div>
                  )}
                  {spot.price_info && (
                    <div className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Euro className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="leading-relaxed">{spot.price_info}</span>
                    </div>
                  )}
                </div>

                {spot.website && (
                  <a
                    href={spot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Bezoek website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
