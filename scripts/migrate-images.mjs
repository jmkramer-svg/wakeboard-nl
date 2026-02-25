// Download afbeeldingen en upload naar Supabase storage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hjqfcybrxgeyssccsdxm.supabase.co',
  'sb_secret_wb0n5SztvZbeuaeH3KMYwQ_-l4gl0l0'
)

// Haal alle spots op met een image_url
const { data: spots } = await supabase
  .from('spots')
  .select('id, name, slug, image_url')
  .not('image_url', 'is', null)

if (!spots?.length) { console.log('Geen spots gevonden'); process.exit(0) }

for (const spot of spots) {
  const url = spot.image_url
  const ext = url.split('.').pop().split('?')[0].toLowerCase().replace('jpeg', 'jpg')
  const filename = `${spot.slug}.${ext}`

  // Download
  let buffer
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) { console.log(`❌ Download mislukt (${res.status}): ${spot.name}`); continue }
    buffer = Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.log(`❌ Download error: ${spot.name} — ${e.message}`); continue
  }

  // Upload naar Supabase storage
  const { error: uploadError } = await supabase.storage
    .from('spot-images')
    .upload(filename, buffer, {
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      upsert: true,
    })

  if (uploadError) { console.log(`❌ Upload mislukt: ${spot.name} — ${uploadError.message}`); continue }

  // Haal publieke URL op
  const { data: { publicUrl } } = supabase.storage.from('spot-images').getPublicUrl(filename)

  // Update spot
  await supabase.from('spots').update({ image_url: publicUrl }).eq('id', spot.id)

  console.log(`✅ ${spot.name}`)
}

console.log('\nKlaar!')
