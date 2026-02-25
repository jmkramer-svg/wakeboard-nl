// Genereer Excel-bestand met Nederlandse wakeboardbanen en waterski locaties
// Run: node scripts/generate-spots.mjs
// Output: scripts/spots-nederland.xlsx

import XLSX from 'xlsx'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ⚠️ Controleer en vul aan vóór importeren:
// - Controleer adressen, coördinaten, websites, prijzen, openingstijden
// - Voeg ontbrekende locaties toe
// - Verwijder locaties die niet meer bestaan

const spots = [
  // ──────────────────────────────────────────────
  // KABELPARKEN
  // ──────────────────────────────────────────────
  {
    naam: 'Action Wakepark Breda',
    beschrijving: 'Een van de grootste kabelparken van Nederland. Professionele kabel met moderne rails, kickers en een aparte beginnerslijn. Gelegen in het Mastbos aan de zuidrand van Breda.',
    provincie: 'Noord-Brabant',
    stad: 'Breda',
    adres: 'Mastbosdreef 1, 4813 RX Breda',
    lat: 51.5484,
    lng: 4.7905,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: 'https://www.actionwakepark.nl',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Delft',
    beschrijving: 'Kabelpark gelegen in het recreatiegebied Delftse Hout. Mooie omgeving voor beginners en gevorderden. Direct aan de rand van de stad.',
    provincie: 'Zuid-Holland',
    stad: 'Delft',
    adres: 'Korftlaan 6, 2616 LJ Delft',
    lat: 52.0116,
    lng: 4.3934,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Amsterdam (Nieuwe Meer)',
    beschrijving: 'Kabelpark aan de Nieuwe Meer in Amsterdam-West. Bereikbaar vanuit het centrum en populair bij stadsbewoners.',
    provincie: 'Noord-Holland',
    stad: 'Amsterdam',
    adres: 'Nieuwe Meerlaan, 1182 Amsterdam',
    lat: 52.3474,
    lng: 4.8292,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Eindhoven (Aquabest)',
    beschrijving: 'Kabelpark gelegen bij het recreatiepark Aquabest ten westen van Eindhoven. Geschikt voor beginners met verhuur van materiaal.',
    provincie: 'Noord-Brabant',
    stad: 'Best',
    adres: 'Aquabest, Best',
    lat: 51.4983,
    lng: 5.3904,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Kardinge Wakepark Groningen',
    beschrijving: 'Kabelpark bij sportcentrum Kardinge in Groningen. Onderdeel van een groot sportcomplex met zwembad en sportvelden.',
    provincie: 'Groningen',
    stad: 'Groningen',
    adres: 'Kardinge, Groningen',
    lat: 53.2194,
    lng: 6.6265,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Almere',
    beschrijving: 'Kabelpark in het waterrijke Almere. Gelegen aan één van de recreatieplassen in de Flevopolder.',
    provincie: 'Flevoland',
    stad: 'Almere',
    adres: 'Almere',
    lat: 52.3702,
    lng: 5.2175,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Hengelo (Twentekanaal)',
    beschrijving: 'Kabelpark gelegen aan het Twentekanaal bij Hengelo. Populaire locatie in Oost-Nederland voor wakeboard en waterski.',
    provincie: 'Overijssel',
    stad: 'Hengelo',
    adres: 'Twentekanaal, Hengelo',
    lat: 52.2653,
    lng: 6.7937,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Hoorn (Hoornsemeer)',
    beschrijving: 'Kabelpark aan het Hoornsemeer net buiten Hoorn. Rustige locatie in Noord-Holland met uitzicht op de omliggende polder.',
    provincie: 'Noord-Holland',
    stad: 'Hoorn',
    adres: 'Hoornsemeer, Hoorn',
    lat: 52.6507,
    lng: 5.0617,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Zeeland (Veerse Meer)',
    beschrijving: 'Kabelpark aan het Veerse Meer in Zeeland. Prachtige locatie in de Zeeuwse delta, geschikt voor wakeboard en watersport in het algemeen.',
    provincie: 'Zeeland',
    stad: 'Veere',
    adres: 'Veerse Meer, Zeeland',
    lat: 51.5500,
    lng: 3.6500,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Nijmegen',
    beschrijving: 'Kabelpark in de omgeving van Nijmegen, gelegen aan één van de recreatieplassen in het rivierengebied.',
    provincie: 'Gelderland',
    stad: 'Nijmegen',
    adres: 'Nijmegen',
    lat: 51.8476,
    lng: 5.8583,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Roermond (Maasplassen)',
    beschrijving: 'Kabelpark bij de Maasplassen nabij Roermond. Het Maasplassengebied is een populaire watersportbestemming in Limburg met tientallen plassen.',
    provincie: 'Limburg',
    stad: 'Roermond',
    adres: 'Maasplassen, Roermond',
    lat: 51.1963,
    lng: 5.9787,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Utrecht (Rhijnauwen)',
    beschrijving: 'Kabelpark bij het recreatiegebied Nieuw Rhijnauwen ten oosten van Utrecht. Populaire uitvalsbasis voor Utrechters.',
    provincie: 'Utrecht',
    stad: 'Bunnik',
    adres: 'Rhijnauwen, Bunnik',
    lat: 52.0743,
    lng: 5.1854,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Assen (Baggelhuizerplas)',
    beschrijving: 'Kabelpark bij de Baggelhuizerplas in Assen. Rustige locatie in Drenthe met goede faciliteiten.',
    provincie: 'Drenthe',
    stad: 'Assen',
    adres: 'Baggelhuizerplas, Assen',
    lat: 52.9897,
    lng: 6.5642,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Wakepark Leeuwarden (Eernewoude)',
    beschrijving: 'Kabelpark bij Eernewoude in Friesland. Gelegen in de Friese meren, ideaal voor waterliefhebbers.',
    provincie: 'Friesland',
    stad: 'Eernewoude',
    adres: 'Eernewoude, Friesland',
    lat: 53.1167,
    lng: 5.9833,
    type: 'kabel',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },

  // ──────────────────────────────────────────────
  // WATERSKI (BOOT)
  // ──────────────────────────────────────────────
  {
    naam: 'Waterski Loosdrecht',
    beschrijving: 'Waterski en wakeboard met speedboot op de Loosdrechtse Plassen. Een van de mooiste merengebieden van Nederland, ideaal voor waterski.',
    provincie: 'Noord-Holland',
    stad: 'Loosdrecht',
    adres: 'Loosdrechtse Plassen, Loosdrecht',
    lat: 52.2006,
    lng: 5.0685,
    type: 'boot',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Waterski Rotterdam (Zevenhuizerplas)',
    beschrijving: 'Waterski met bootje op de Zevenhuizerplas bij Rotterdam. Populaire locatie voor Rotterdammers die willen waterskiën.',
    provincie: 'Zuid-Holland',
    stad: 'Zevenhuizen',
    adres: 'Zevenhuizerplas, Zevenhuizen',
    lat: 51.9800,
    lng: 4.5583,
    type: 'boot',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Waterski Friesland (Sneek)',
    beschrijving: 'Waterski en wakeboard op het Sneekermeer en omliggende meren. Friesland heeft een uitstekend watersportnetwerk.',
    provincie: 'Friesland',
    stad: 'Sneek',
    adres: 'Sneekermeer, Sneek',
    lat: 53.0328,
    lng: 5.6578,
    type: 'boot',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Waterski Maasplassen Roermond',
    beschrijving: 'Waterskiën op de Maasplassen bij Roermond met speedboot. Het Maasplassengebied heeft speciale waterskizones.',
    provincie: 'Limburg',
    stad: 'Roermond',
    adres: 'Maasplassen, Roermond',
    lat: 51.2050,
    lng: 5.9900,
    type: 'boot',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Waterski Biesbosch',
    beschrijving: 'Waterskiën in het Nationaal Park de Biesbosch. Unieke omgeving in het deltagebied van Noord-Brabant en Zuid-Holland.',
    provincie: 'Noord-Brabant',
    stad: 'Drimmelen',
    adres: 'Biesbosch, Drimmelen',
    lat: 51.7200,
    lng: 4.8300,
    type: 'boot',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
  {
    naam: 'Waterski Veluwemeer',
    beschrijving: 'Waterskiën op het Veluwemeer bij Harderwijk. Het Randmeer biedt uitstekende mogelijkheden voor waterski en wakeboard achter de boot.',
    provincie: 'Gelderland',
    stad: 'Harderwijk',
    adres: 'Veluwemeer, Harderwijk',
    lat: 52.3567,
    lng: 5.6175,
    type: 'boot',
    niveau: 'alle niveaus',
    website: '',
    telefoon: '',
    email: '',
    prijs: '',
    openingstijden: '',
  },
]

// Maak het werkboek aan
const wb = XLSX.utils.book_new()

const wsData = [
  // Header rij
  ['naam', 'beschrijving', 'provincie', 'stad', 'adres', 'lat', 'lng', 'type', 'niveau', 'website', 'telefoon', 'email', 'prijs', 'openingstijden'],
  // Data rijen
  ...spots.map(s => [
    s.naam,
    s.beschrijving,
    s.provincie,
    s.stad,
    s.adres,
    s.lat,
    s.lng,
    s.type,
    s.niveau,
    s.website,
    s.telefoon,
    s.email,
    s.prijs,
    s.openingstijden,
  ])
]

const ws = XLSX.utils.aoa_to_sheet(wsData)

// Kolombreedte instellen
ws['!cols'] = [
  { wch: 35 },  // naam
  { wch: 60 },  // beschrijving
  { wch: 18 },  // provincie
  { wch: 18 },  // stad
  { wch: 40 },  // adres
  { wch: 10 },  // lat
  { wch: 10 },  // lng
  { wch: 8  },  // type
  { wch: 15 },  // niveau
  { wch: 40 },  // website
  { wch: 18 },  // telefoon
  { wch: 30 },  // email
  { wch: 30 },  // prijs
  { wch: 40 },  // openingstijden
]

XLSX.utils.book_append_sheet(wb, ws, 'Spots')

const outputPath = join(__dirname, 'spots-nederland.xlsx')
XLSX.writeFile(wb, outputPath)

console.log(`✅ Excel bestand aangemaakt: ${outputPath}`)
console.log(`📍 ${spots.length} locaties opgenomen`)
console.log()
console.log('Geldige waarden:')
console.log('  type:   kabel | boot | beide')
console.log('  niveau: beginner | intermediate | gevorderd | alle niveaus')
console.log('  provincie: Groningen | Friesland | Drenthe | Overijssel | Flevoland |')
console.log('             Gelderland | Utrecht | Noord-Holland | Zuid-Holland |')
console.log('             Zeeland | Noord-Brabant | Limburg')
