import { readFileSync } from 'fs'

// Load .env.local manually
const envContent = readFileSync('.env.local', 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import Anthropic from '@anthropic-ai/sdk'
import { buildArticlePrompt } from '../src/lib/article-prompt'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const [{ data: spots }, { data: articles }] = await Promise.all([
    supabase.from('spots').select('name, slug, city, province').eq('is_published', true),
    supabase.from('articles').select('title, slug').eq('is_published', true),
  ])

  const articleId = process.argv[2]
  if (!articleId) {
    console.error('Usage: npx tsx scripts/regen-article.ts <article-id>')
    process.exit(1)
  }

  const { data: articleData } = await supabase
    .from('articles')
    .select('title')
    .eq('id', articleId)
    .single()

  if (!articleData) {
    console.error('Article not found:', articleId)
    process.exit(1)
  }

  const topic = articleData.title
  const prompt = buildArticlePrompt(topic, spots ?? [], articles ?? [])

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  console.log('Generating article...')
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  const fullText = (msg.content[0] as { type: 'text'; text: string }).text

  const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/)
  if (!jsonMatch) {
    console.error('No JSON block found in response')
    process.exit(1)
  }

  const htmlContent = fullText.replace(/```json[\s\S]*?```/, '').trim()
  const meta = JSON.parse(jsonMatch[1])

  const { error } = await supabase.from('articles').update({
    content: htmlContent,
    meta_title: meta.meta_title,
    meta_description: meta.meta_description,
    focus_keyword: meta.focus_keyword,
    excerpt: meta.excerpt,
    target_keywords: meta.target_keywords,
    faq_items: meta.faq_items,
  }).eq('id', articleId)

  if (error) {
    console.log('DB Error:', JSON.stringify(error))
  } else {
    console.log('Article updated!')
    const h2Count = (htmlContent.match(/<h2>/gi) || []).length
    console.log('H2 count:', h2Count)
    console.log('Meta title:', meta.meta_title)
  }
}

main().catch(console.error)
