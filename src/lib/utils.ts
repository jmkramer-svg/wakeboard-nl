import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const PROVINCES = [
  'Groningen',
  'Friesland',
  'Drenthe',
  'Overijssel',
  'Flevoland',
  'Gelderland',
  'Utrecht',
  'Noord-Holland',
  'Zuid-Holland',
  'Zeeland',
  'Noord-Brabant',
  'Limburg',
] as const

export const TYPE_LABELS: Record<string, string> = {
  kabel: 'Kabelpark',
  boot: 'Bootrijden',
  beide: 'Kabel & Boot',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  gevorderd: 'Gevorderd',
  'alle niveaus': 'Alle niveaus',
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}
