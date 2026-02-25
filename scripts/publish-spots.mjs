import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hjqfcybrxgeyssccsdxm.supabase.co',
  'sb_secret_wb0n5SztvZbeuaeH3KMYwQ_-l4gl0l0'
)

const { data, error } = await supabase
  .from('spots')
  .update({ is_published: true })
  .eq('is_published', false)
  .select('id, name')

if (error) {
  console.error('❌ Fout:', error.message)
  process.exit(1)
}

console.log(`✅ ${data.length} spots gepubliceerd`)
data.forEach(s => console.log(`   - ${s.name}`))
