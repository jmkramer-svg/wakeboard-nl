import { createClient } from '@/lib/supabase/server'
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

  const client = new Anthropic()

  const prompt = `Schrijf een uitgebreid SEO-geoptimaliseerd artikel over het volgende onderwerp: "${topic}"

Het artikel is voor een Nederlandse website over wakeboarden (wakeboard-nl.nl).

Schrijf het artikel in HTML-formaat met H1, H2, H3 tags en alinea's.
Gebruik <h1> voor de hoofdtitel, <h2> voor secties, <h3> voor subsecties, <p> voor tekst.
Maak het artikel minimaal 600 woorden lang.

Na het HTML-artikel, voeg PRECIES dit JSON-blok toe (geen andere tekst erna):

\`\`\`json
{
  "meta_title": "...",
  "meta_description": "...",
  "focus_keyword": "...",
  "excerpt": "..."
}
\`\`\`

Regels voor het JSON-blok:
- meta_title: max 60 tekens
- meta_description: max 160 tekens
- focus_keyword: het belangrijkste zoekwoord
- excerpt: 1-2 zinnen samenvatting`

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
