import Anthropic from '@anthropic-ai/sdk'

const SUPABASE_URL = 'https://api.supabase.com/v1/projects/hjqfcybrxgeyssccsdxm/database/query'
const SUPABASE_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

const TRICKS = [
  'Ollie',
  'Surface 180',
  'Wake Jump',
  'Butterslide',
  'Indy Grab',
  'Melan Grab',
  'Nose Grab',
  'Backroll',
  'Tantrum',
  'Raley',
  'Boardslide',
  'Toeside Backroll',
]

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildPrompt(trickName) {
  return `Je bent een ervaren wakeboard-instructeur en schrijft voor wakeboard-nl.nl.

Genereer een complete, gedetailleerde beschrijving van de wakeboard-trick: "${trickName}"

Geef je antwoord als EXACT EEN JSON-object met de volgende structuur. Schrijf alles in het Nederlands.

{
  "description": "Een duidelijke beschrijving van de trick in 2-4 zinnen.",
  "category": "surface | ollie | invert | grab | rail | switch",
  "difficulty_level": 1-5,
  "direction": "regular | switch | both",
  "trick_type": "boot | cable | both",
  "prerequisites": {
    "tricks": ["..."],
    "physical": ["..."],
    "mental": ["..."]
  },
  "equipment": {
    "board_type": "...",
    "fins": "...",
    "protection": "...",
    "speed": "...",
    "line_length": "...",
    "obstacle_type": ""
  },
  "steps": {
    "approach": { "edge_type": "...", "speed_buildup": "...", "body_position": "..." },
    "takeoff": { "timing": "...", "weight_distribution": "...", "rotation": "..." },
    "air": { "focus_point": "...", "grab_timing": "...", "knee_position": "..." },
    "landing": { "board_position": "...", "edge_choice": "...", "knee_absorption": "...", "ride_out": "..." }
  },
  "common_mistakes": [
    { "mistake": "...", "explanation": "..." }
  ],
  "exercise_progression": [
    { "title": "...", "description": "..." }
  ],
  "safety": {
    "injury_risks": ["..."],
    "safe_falling": "...",
    "when_to_stop": "..."
  },
  "variations": [
    { "name": "...", "description": "..." }
  ]
}

Regels:
- Minimaal 3 common_mistakes, 4 exercise_progression stappen, 2 variations, 2 injury_risks
- Alles in het Nederlands
- Wees specifiek en praktisch
- Antwoord met ALLEEN het JSON-object`
}

async function generateTrick(client, trickName) {
  console.log(`  Genereren: ${trickName}...`)
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildPrompt(trickName) }],
  })

  const text = response.content[0].text
  const jsonStr = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '')
  return JSON.parse(jsonStr)
}

async function insertTrick(trickName, data) {
  const slug = slugify(trickName)
  const now = new Date().toISOString()

  const diffMap = { 1: 'beginner', 2: 'beginner', 3: 'intermediate', 4: 'gevorderd', 5: 'gevorderd' }

  const query = `
    INSERT INTO tricks (
      title, slug, description, difficulty, image_url, video_url,
      is_current, is_published, published_at, created_at, updated_at,
      category, difficulty_level, direction, trick_type,
      prerequisites, equipment, steps, common_mistakes,
      exercise_progression, safety, variations
    ) VALUES (
      '${trickName.replace(/'/g, "''")}',
      '${slug}',
      '${(data.description || '').replace(/'/g, "''")}',
      '${diffMap[data.difficulty_level] || 'beginner'}',
      NULL, NULL,
      false, true, '${now}', '${now}', '${now}',
      '${data.category || 'surface'}',
      ${data.difficulty_level || 1},
      '${data.direction || 'regular'}',
      '${data.trick_type || 'both'}',
      '${JSON.stringify(data.prerequisites || {}).replace(/'/g, "''")}',
      '${JSON.stringify(data.equipment || {}).replace(/'/g, "''")}',
      '${JSON.stringify(data.steps || {}).replace(/'/g, "''")}',
      '${JSON.stringify(data.common_mistakes || []).replace(/'/g, "''")}',
      '${JSON.stringify(data.exercise_progression || []).replace(/'/g, "''")}',
      '${JSON.stringify(data.safety || {}).replace(/'/g, "''")}',
      '${JSON.stringify(data.variations || []).replace(/'/g, "''")}'
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id, title;
  `

  const res = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const result = await res.json()
  if (result.error || result.message) {
    console.log(`  FOUT bij ${trickName}:`, result.error || result.message)
    return false
  }
  return true
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY ontbreekt')
    process.exit(1)
  }
  if (!SUPABASE_TOKEN) {
    console.error('SUPABASE_ACCESS_TOKEN ontbreekt')
    process.exit(1)
  }

  const client = new Anthropic()

  console.log(`\nStart: ${TRICKS.length} tricks genereren en invoegen...\n`)

  let success = 0
  for (const trick of TRICKS) {
    try {
      const data = await generateTrick(client, trick)
      const ok = await insertTrick(trick, data)
      if (ok) {
        success++
        console.log(`  OK: ${trick}`)
      }
    } catch (e) {
      console.log(`  FOUT bij ${trick}: ${e.message}`)
    }
  }

  console.log(`\nKlaar! ${success}/${TRICKS.length} tricks ingevoegd.\n`)
}

main()
