import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { spot_id, author_name, rating, content, author_email } = body

  if (!spot_id || !author_name || !rating || !content) {
    return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 })
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Beoordeling moet tussen 1 en 5 zijn' }, { status: 400 })
  }

  if (typeof content !== 'string' || content.trim().length < 10) {
    return NextResponse.json({ error: 'Review is te kort (minimaal 10 tekens)' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('reviews').insert({
    spot_id,
    author_name: String(author_name).trim().slice(0, 100),
    author_email: author_email ? String(author_email).trim() : null,
    rating,
    content: content.trim().slice(0, 2000),
    is_approved: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
