'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveReview(id: string) {
  const supabase = await createClient()
  await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
  revalidatePath('/admin/reviews')
}

export async function deleteReview(id: string) {
  const supabase = await createClient()
  await supabase.from('reviews').delete().eq('id', id)
  revalidatePath('/admin/reviews')
}
