import Anthropic from '@anthropic-ai/sdk'

const SUPABASE_URL = 'https://api.supabase.com/v1/projects/hjqfcybrxgeyssccsdxm/database/query'
const SUPABASE_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

const prompt = `Je bent een ervaren wakeboard-instructeur. Genereer een complete beschrijving van de wakeboard-trick: "Raley"

Geef je antwoord als EXACT EEN JSON-object. Schrijf alles in het Nederlands. Geen tekst voor of na de JSON. Gebruik GEEN speciale aanhalingstekens of Unicode-tekens in de JSON.

{
  "description": "2-4 zinnen",
  "category": "invert",
  "difficulty_level": 4,
  "direction": "regular",
  "trick_type": "both",
  "prerequisites": { "tricks": ["..."], "physical": ["..."], "mental": ["..."] },
  "equipment": { "board_type": "...", "fins": "...", "protection": "...", "speed": "...", "line_length": "...", "obstacle_type": "" },
  "steps": {
    "approach": { "edge_type": "...", "speed_buildup": "...", "body_position": "..." },
    "takeoff": { "timing": "...", "weight_distribution": "...", "rotation": "..." },
    "air": { "focus_point": "...", "grab_timing": "...", "knee_position": "..." },
    "landing": { "board_position": "...", "edge_choice": "...", "knee_absorption": "...", "ride_out": "..." }
  },
  "common_mistakes": [ { "mistake": "...", "explanation": "..." } ],
  "exercise_progression": [ { "title": "...", "description": "..." } ],
  "safety": { "injury_risks": ["..."], "safe_falling": "...", "when_to_stop": "..." },
  "variations": [ { "name": "...", "description": "..." } ]
}`

async function main() {
  const client = new Anthropic()
  console.log('Genereren: Raley...')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].text
  const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').replace(/^[^{]*/, '').replace(/[^}]*$/, '')
  const data = JSON.parse(jsonStr)

  const slug = 'raley'
  const now = new Date().toISOString()
  const esc = (s) => (s || '').replace(/'/g, "''")

  const query = `INSERT INTO tricks (title, slug, description, difficulty, is_published, published_at, created_at, updated_at, category, difficulty_level, direction, trick_type, prerequisites, equipment, steps, common_mistakes, exercise_progression, safety, variations)
VALUES ('Raley', '${slug}', '${esc(data.description)}', 'gevorderd', true, '${now}', '${now}', '${now}', '${data.category}', ${data.difficulty_level}, '${data.direction}', '${data.trick_type}', '${esc(JSON.stringify(data.prerequisites))}', '${esc(JSON.stringify(data.equipment))}', '${esc(JSON.stringify(data.steps))}', '${esc(JSON.stringify(data.common_mistakes))}', '${esc(JSON.stringify(data.exercise_progression))}', '${esc(JSON.stringify(data.safety))}', '${esc(JSON.stringify(data.variations))}')
ON CONFLICT (slug) DO NOTHING RETURNING id;`

  const res = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SUPABASE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const result = await res.json()
  if (result.error) console.log('FOUT:', result.error)
  else console.log('Raley ingevoegd!')
}

main().catch(e => console.error('Fout:', e.message))
