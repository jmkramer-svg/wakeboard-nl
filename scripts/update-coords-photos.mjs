import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hjqfcybrxgeyssccsdxm.supabase.co',
  'sb_secret_wb0n5SztvZbeuaeH3KMYwQ_-l4gl0l0'
)

const updates = [
  { naam: 'Down Under Cablepark', lat: 52.0495, lng: 5.1243, foto_url: 'https://assets.plaece.nl/odp-ubase/image/wakeboard-events-min-960x640_3433911045.jpg' },
  { naam: "Wet 'n Wild WakePark", lat: 52.1349, lng: 4.6726, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/11/Wet-n-Wild-Wakepark.jpg' },
  { naam: 'Cablepark Aquabest', lat: 51.5006, lng: 5.4390, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/10/Cablepark-Aquabest.jpg' },
  { naam: 'Burnside Cablepark', lat: 52.3098, lng: 5.9986, foto_url: 'https://www.burnsidecablepark.nl/wp-content/uploads/2022/09/BurnsideCablepark-scaled.jpg' },
  { naam: 'SKEEF', lat: 52.6443, lng: 4.7969, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/11/SKEEF.jpg' },
  { naam: 'Lakeside Cablepark Zwolle', lat: 52.4965, lng: 6.1469, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2015/07/Lakeside-Zwolle-1.jpg' },
  { naam: 'Project 7 Cablepark Rotterdam', lat: 51.9783, lng: 4.5773, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/11/Project7-Cablepark-Nesselande-Rotterdam-Zuid-Holland.jpg' },
  { naam: 'Cablepark VIEW Almere', lat: 52.3581, lng: 5.2152, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2023/05/Cablepark-VIEW-Almere.jpg' },
  { naam: 'Kabelwaterskibaan Stroombroek', lat: 51.9332, lng: 6.2730, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/10/Kabelwaterskibaan-Stroombroek.jpg' },
  { naam: 'Zeumeren Watersport', lat: 52.1761, lng: 5.6221, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/10/Waterskibaan-Zeumeren.jpg' },
  { naam: 'Waterski Twente', lat: 52.1816, lng: 6.8390, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/11/Waterski-Twente.jpg' },
  { naam: 'Wakepark Groningen', lat: 53.2387, lng: 6.5994, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2023/05/WakePark-Groningen.jpg' },
  { naam: 'Break Out Grunopark', lat: 53.2161, lng: 6.6641, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/10/Break-Out-Grunopark.jpg' },
  { naam: 'Waterskibaan Sneek', lat: 53.0343, lng: 5.7235, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2023/05/Waterskibaan-Sneek.jpg' },
  { naam: 'Waterskicentrum De Berendonck', lat: 51.8115, lng: 5.7712, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/10/Waterskicentrum-De-Berendonck.jpg' },
  { naam: 'Cablepark de Wollebrand', lat: 51.9929, lng: 4.2404, foto_url: 'https://www.kabelskibaan.nl/wp-content/uploads/wakeboard.png' },
  { naam: 'Waterskibaan De IJzeren Man', lat: 51.2418, lng: 5.6727, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2025/02/Waterskibaan-De-IJzeren-Man.jpg' },
  { naam: '720 Cablepark', lat: 51.3834, lng: 5.9762, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/11/720-Cablepark-Sevenum.jpg' },
  { naam: 'Beaver Creek Wake Park', lat: 51.2043, lng: 5.9784, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2025/02/Beaver-Creek-Wake-Park-Roermond.jpg' },
  { naam: 'Schotsman Watersport Kamperland', lat: 51.5717, lng: 3.6518, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/11/Schotsman-Watersportcentrum.jpg' },
  { naam: 'Waterskicentrum Ermerstrand', lat: 52.7475, lng: 6.7972, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2023/05/Recreatiepark-Ermerstrand.jpg' },
  { naam: 'BetuweStrand Recreatie', lat: 51.8985, lng: 5.1843, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2023/05/BetuweStrand.jpg' },
  { naam: 'Het Waterskicentrum (De Kempervennen)', lat: 51.3330, lng: 5.4230, foto_url: 'https://www.hetwaterskicentrum.nl/wp-content/uploads/WSC-KV-Home-button-terras-aan-het-strand.jpg' },
  { naam: 'Wakeflow Cable & Aquapark', lat: 53.1045, lng: 6.8436, foto_url: 'https://waterskinederland.nl/wp-content/uploads/2013/10/Watersportcentre-Veendam.jpg' },
  { naam: 'GoFast Scheveningen', lat: 52.0991, lng: 4.2710, foto_url: 'https://www.gofastscheveningen.nl/wp-content/uploads/2017/07/wakeboard-boot.jpg' },
  { naam: 'Waterskicentrum Splash', lat: 51.8138, lng: 5.3914, foto_url: '' },
]

let ok = 0, fail = 0
for (const s of updates) {
  const { error } = await supabase
    .from('spots')
    .update({ latitude: s.lat, longitude: s.lng, image_url: s.foto_url || null })
    .eq('name', s.naam)

  if (error) {
    console.error(`❌ ${s.naam}: ${error.message}`)
    fail++
  } else {
    console.log(`✅ ${s.naam}`)
    ok++
  }
}

console.log(`\nKlaar: ${ok} bijgewerkt, ${fail} mislukt`)
