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

export type TrickCategory = 'surface' | 'ollie' | 'invert' | 'grab' | 'rail' | 'switch'
export type TrickDirection = 'regular' | 'switch' | 'both'
export type TrickTypeOption = 'boot' | 'cable' | 'both'

export interface TrickPrerequisites {
  tricks: string[]
  physical: string[]
  mental: string[]
}

export interface TrickEquipment {
  board_type?: string
  fins?: string
  protection?: string
  speed?: string
  line_length?: string
  obstacle_type?: string
}

export interface TrickStepPhase {
  edge_type?: string
  speed_buildup?: string
  body_position?: string
  timing?: string
  weight_distribution?: string
  rotation?: string
  focus_point?: string
  grab_timing?: string
  knee_position?: string
  board_position?: string
  edge_choice?: string
  knee_absorption?: string
  ride_out?: string
}

export interface TrickSteps {
  approach: TrickStepPhase
  takeoff: TrickStepPhase
  air: TrickStepPhase
  landing: TrickStepPhase
}

export interface TrickMistake {
  mistake: string
  explanation: string
}

export interface TrickExercise {
  title: string
  description: string
}

export interface TrickSafety {
  injury_risks: string[]
  safe_falling: string
  when_to_stop: string
}

export interface TrickVariation {
  name: string
  description: string
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
  category: TrickCategory | null
  difficulty_level: number
  direction: TrickDirection
  trick_type: TrickTypeOption
  prerequisites: TrickPrerequisites
  equipment: TrickEquipment
  steps: TrickSteps
  common_mistakes: TrickMistake[]
  exercise_progression: TrickExercise[]
  safety: TrickSafety
  variations: TrickVariation[]
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
