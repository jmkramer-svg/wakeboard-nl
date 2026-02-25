// Importeer spots uit Excel naar Supabase
// Run: node scripts/import-spots.mjs

import XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://hjqfcybrxgeyssccsdxm.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_wb0n5SztvZbeuaeH3KMYwQ_-l4gl0l0'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseRow(row) {
  const name = String(row['naam'] ?? row['name'] ?? '').trim()
  if (!name) return null

  return {
    name,
    slug: slugify(name),
    description: String(row['beschrijving'] ?? row['description'] ?? '').trim(),
    province: String(row['provincie'] ?? row['province'] ?? 'Noord-Holland').trim(),
    city: String(row['stad'] ?? row['city'] ?? '').trim(),
    address: String(row['adres'] ?? row['address'] ?? '').trim() || null,
    latitude: parseFloat(String(row['lat'] ?? row['latitude'] ?? '52.3')) || 52.3,
    longitude: parseFloat(String(row['lng'] ?? row['longitude'] ?? '5.3')) || 5.3,
    type: String(row['type'] ?? 'kabel').trim(),
    difficulty: String(row['niveau'] ?? row['difficulty'] ?? 'alle niveaus').trim(),
    website: String(row['website'] ?? '').trim() || null,
    phone: String(row['telefoon'] ?? row['phone'] ?? '').trim() || null,
    email: String(row['email'] ?? '').trim() || null,
    image_url: String(row['image_url'] ?? '').trim() || null,
    features: [],
    obstacles: [],
    price_info: String(row['prijs'] ?? row['price_info'] ?? '').trim() || null,
    opening_hours: String(row['openingstijden'] ?? row['opening_hours'] ?? '').trim() || null,
    is_published: false,
  }
}

async function main() {
  const filePath = join(__dirname, 'spots-nederland.xlsx')
  console.log(`📂 Bestand laden: ${filePath}`)

  const wb = XLSX.readFile(filePath)
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet)

  const rows = data.map(parseRow).filter(Boolean)
  console.log(`📍 ${rows.length} spots gevonden in Excel`)

  // Check op dubbele slugs
  const slugs = rows.map(r => r.slug)
  const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
  if (duplicates.length > 0) {
    console.warn(`⚠️  Dubbele slugs gevonden: ${duplicates.join(', ')}`)
  }

  console.log('\nImporteren...')
  const { data: inserted, error } = await supabase
    .from('spots')
    .insert(rows)
    .select('id, name, slug')

  if (error) {
    console.error('❌ Fout bij importeren:', error.message)
    process.exit(1)
  }

  console.log(`✅ ${inserted.length} spots succesvol geïmporteerd (is_published = false)`)
  inserted.forEach(s => console.log(`   - ${s.name} (${s.slug})`))
}

main()
