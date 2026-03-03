interface ContextSpot {
  name: string
  slug: string
  city: string
  province: string
}

interface ContextArticle {
  title: string
  slug: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wakeboard-nl.nl'

export function buildArticlePrompt(
  topic: string,
  spots: ContextSpot[],
  articles: ContextArticle[]
): string {
  const spotLinks = spots
    .slice(0, 15)
    .map((s) => `- [${s.name}](${siteUrl}/spots/${s.slug}) — ${s.city}, ${s.province}`)
    .join('\n')

  const articleLinks = articles
    .slice(0, 10)
    .map((a) => `- [${a.title}](${siteUrl}/articles/${a.slug})`)
    .join('\n')

  return `Schrijf een uitgebreid, SEO-geoptimaliseerd artikel over: "${topic}"

Het artikel is voor wakeboard-nl.nl, de complete Nederlandse gids voor wakeboarden.

## Structuurregels
- Gebruik HTML-formaat: <h1> voor de hoofdtitel, <h2> voor secties, <h3> voor subsecties, <p> voor tekst.
- Begin met EXACT ÉÉN <h1> als hoofdtitel.
- Gebruik VEEL tussenkopjes: minimaal 8-12 <h2> kopjes. Elk deelonderwerp krijgt een eigen <h2>.
- Splits het artikel op in korte, scanbare secties.
- Elke <h2>-sectie bevat 3-5 korte alinea's. NOOIT slechts 1 alinea onder een kopje.
- Houd alinea's KORT: max 1-2 zinnen per <p>. Begin na elke gedachte of elk punt een NIEUWE <p>-tag.
- Gebruik <h3> binnen secties als er meerdere deelaspecten zijn.
- Maak het artikel minimaal 1200 woorden lang.
- Gebruik <ul>/<ol> lijsten waar gepast (tips, opsommingen, voor-/nadelen).
- Gebruik <strong> voor belangrijke termen.
- Voeg waar relevant een pluspunten/minpunten-lijst toe met <ul>.
- Maak kopjes concreet en beschrijvend, niet vaag. Bijvoorbeeld: "Welk board past bij beginners?" in plaats van "Boards".

## SEO-regels
- Verwerk het focus-keyword natuurlijk in: de H1, de eerste alinea, minimaal 2 H2-kopjes, en door het hele artikel.
- Gebruik LSI-keywords (semantisch verwante termen) door het hele artikel.
- Schrijf een duidelijke samenvattende eerste alinea die als featured snippet kan dienen.
- Eindig met een concluderend stuk.

## LLM-vindbaarheid (LLMO)
- Schrijf stellige, feitelijke uitspraken die LLMs als antwoord kunnen overnemen.
- Gebruik definitie-zinnen: "X is een ...", "Y wordt gebruikt voor ...".
- Gebruik gestructureerde lijsten voor opsommingen.
- Beantwoord impliciete vragen direct en concreet.

## Afbeelding-placeholders
- Plaats EXACT 2 keer de marker \`<!-- IMAGE -->\` in het artikel.
- De eerste \`<!-- IMAGE -->\` komt direct NA de eerste <h2>-sectie (na de laatste </p> van die sectie).
- De tweede \`<!-- IMAGE -->\` komt direct NA de derde <h2>-sectie.
- Voeg GEEN andere afbeeldingstags of -placeholders toe.

## FAQ-sectie
- Voeg aan het EINDE van het artikel een FAQ-sectie toe met minimaal 4 veelgestelde vragen.
- Gebruik <h2>Veelgestelde vragen</h2> als kop.
- Elke vraag als <h3> en het antwoord als <p>.
- Beantwoord vragen bondig maar volledig (2-4 zinnen per antwoord).

## Interne links
Verwerk waar relevant links naar bestaande pagina's op de site. Gebruik <a href="URL">anchor tekst</a>.

Beschikbare spots:
${spotLinks || '(geen spots beschikbaar)'}

Beschikbare artikelen:
${articleLinks || '(geen andere artikelen beschikbaar)'}

## Output
Na het volledige HTML-artikel, voeg PRECIES dit JSON-blok toe (geen andere tekst erna):

\`\`\`json
{
  "meta_title": "...",
  "meta_description": "...",
  "focus_keyword": "...",
  "excerpt": "...",
  "target_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "faq_items": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}
\`\`\`

Regels voor het JSON-blok:
- meta_title: max 60 tekens, bevat het focus-keyword
- meta_description: max 160 tekens, wervend en met focus-keyword
- focus_keyword: het belangrijkste zoekwoord (1-3 woorden)
- excerpt: 1-2 zinnen samenvatting
- target_keywords: 4-6 aanvullende zoekwoorden (LSI-keywords)
- faq_items: EXACT dezelfde vragen en antwoorden als in de FAQ-sectie van het artikel`
}
