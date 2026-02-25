export type WakeboardType = 'kabel' | 'boot' | 'beide'
export type Province =
  | 'Groningen'
  | 'Friesland'
  | 'Drenthe'
  | 'Overijssel'
  | 'Flevoland'
  | 'Gelderland'
  | 'Utrecht'
  | 'Noord-Holland'
  | 'Zuid-Holland'
  | 'Zeeland'
  | 'Noord-Brabant'
  | 'Limburg'

export interface Spot {
  id: string
  name: string
  slug: string
  description: string
  province: Province
  city: string
  address: string | null
  latitude: number
  longitude: number
  type: WakeboardType
  difficulty: 'beginner' | 'intermediate' | 'gevorderd' | 'alle niveaus'
  website: string | null
  phone: string | null
  email: string | null
  image_url: string | null
  features: string[]
  obstacles: string[]
  price_info: string | null
  opening_hours: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface SpotFilters {
  province?: Province | ''
  type?: WakeboardType | ''
  difficulty?: string
  search?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  focus_keyword: string | null
  faq_items: FaqItem[]
  table_of_contents: TocItem[]
  target_keywords: string[]
  seo_score: number
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Trick {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  image_url: string | null
  video_url: string | null
  is_current: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  spot_id: string
  author_name: string
  author_email: string | null
  rating: number
  content: string
  is_approved: boolean
  created_at: string
}
