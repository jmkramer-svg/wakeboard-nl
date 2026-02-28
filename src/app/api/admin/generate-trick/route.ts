import { createClient } from '@/lib/supabase/server'
import { buildTrickPrompt } from '@/lib/trick-prompt'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
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

  const { trickName } = await req.json()
  if (!trickName?.trim()) {
    return new Response(JSON.stringify({ error: 'Trick-naam is verplicht' }), { status: 400 })
  }

  const prompt = buildTrickPrompt(trickName)
  const client = new Anthropic()

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
