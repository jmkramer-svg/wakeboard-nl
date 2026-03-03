import { readFileSync } from 'fs'
const envContent = readFileSync('.env.local', 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

async function main() {
  const { data } = await supabase
    .from('articles')
    .select('content')
    .eq('id', 'f42e7835-9fa2-4244-b47b-34b03b89be00')
    .single()

  const content = data?.content ?? ''
  const h2Count = (content.match(/<h2>/gi) || []).length
  const pCount = (content.match(/<p>/gi) || []).length
  console.log(`H2: ${h2Count} | P tags: ${pCount}`)

  const sections = content.split(/<h2>/i).slice(1, 5)
  for (let i = 0; i < sections.length; i++) {
    const ps = (sections[i].match(/<p>/gi) || []).length
    const headingMatch = sections[i].match(/^(.*?)<\/h2>/i)
    const heading = headingMatch ? headingMatch[1] : '?'
    console.log(`Section ${i + 1}: "${heading}" — ${ps} alinea's`)
  }
}

main()
