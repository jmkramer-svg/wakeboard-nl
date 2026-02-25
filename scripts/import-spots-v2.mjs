import XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  'https://hjqfcybrxgeyssccsdxm.supabase.co',
  'sb_secret_wb0n5SztvZbeuaeH3KMYwQ_-l4gl0l0'
)

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function str(val) {
  return String(val ?? '').trim()
}

function parseRow(row) {
  const name = str(row['naam'])
  if (!name) return null

  // Faciliteiten → features array
  const features = []
  if (str(row['faciliteit_verhuur']) === 'ja')       features.push('Verhuur')
  if (str(row['faciliteit_restaurant']) === 'ja')    features.push('Horeca')
  if (str(row['faciliteit_warme_douche']) === 'ja')  features.push('Warme douches')
  if (str(row['faciliteit_parkeren']) === 'ja')      features.push('Parkeren')
  if (str(row['faciliteit_kleedkamers']) === 'ja')   features.push('Kleedkamers')

  // Obstacles → obstacles array
  const obstaclesRaw = str(row['obstacles_lijst'])
  const obstacles = obstaclesRaw
    ? obstaclesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return {
    name,
    slug: slugify(name),
    description: str(row['beschrijving']),
    province: str(row['provincie']) || 'Noord-Holland',
    city: str(row['stad']),
    address: str(row['adres']) || null,
    latitude: parseFloat(str(row['lat'])) || 52.3,
    longitude: parseFloat(str(row['lng'])) || 5.3,
    type: str(row['type']) || 'kabel',
    difficulty: str(row['niveau']) || 'alle niveaus',
    website: str(row['website']) || null,
    phone: str(row['telefoon']) || null,
    email: str(row['email']) || null,
    image_url: str(row['foto_url']) || null,
    price_info: str(row['prijs']) || null,
    opening_hours: str(row['openingstijden']) || null,
    features,
    obstacles,
    is_published: false,
  }
}

const filePath = join(__dirname, 'spots-nederland-v2.xlsx')
const wb = XLSX.readFile(filePath)
const sheet = wb.Sheets[wb.SheetNames[0]]
const data = XLSX.utils.sheet_to_json(sheet)
const rows = data.map(parseRow).filter(Boolean)

console.log(`📍 ${rows.length} spots gevonden`)

const { data: inserted, error } = await supabase.from('spots').insert(rows).select('id, name')

if (error) {
  console.error('❌ Fout:', error.message)
  process.exit(1)
}

console.log(`✅ ${inserted.length} spots geïmporteerd (is_published = false)`)
inserted.forEach(s => console.log(`   - ${s.name}`))
