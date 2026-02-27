import { createClient } from '@/lib/supabase/server'
import { buildArticlePrompt } from '@/lib/article-prompt'
import { searchPexelsPhotos } from '@/lib/pexels'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Niet geauthenticeerd' }), { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY niet ingesteld in .env.local' }),
      { status: 500 }
    )
  }

  const { topic } = await req.json()
  if (!topic?.trim()) {
    return new Response(JSON.stringify({ error: 'Onderwerp is verplicht' }), { status: 400 })
  }

  // Fetch context for internal links
  const [{ data: spots }, { data: articles }] = await Promise.all([
    supabase
      .from('spots')
      .select('name, slug, city, province')
      .eq('is_published', true),
    supabase
      .from('articles')
      .select('title, slug')
      .eq('is_published', true),
  ])

  const prompt = buildArticlePrompt(topic, spots ?? [], articles ?? [])

  const client = new Anthropic()

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      let fullText = ''

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          fullText += chunk.delta.text
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }

      // Extract focus_keyword from JSON block for Pexels search
      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)```/)
      let searchQuery = topic
      if (jsonMatch) {
        try {
          const seo = JSON.parse(jsonMatch[1])
          if (seo.focus_keyword) searchQuery = seo.focus_keyword
        } catch {}
      }

      // Search Pexels for relevant photos
      const photos = await searchPexelsPhotos(`${searchQuery} wakeboard`, 2)

      // Send marker + image data
      controller.enqueue(
        encoder.encode(`\n<!-- PEXELS_DATA:${JSON.stringify(photos)} -->`)
      )

      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
