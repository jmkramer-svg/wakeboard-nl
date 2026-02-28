import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Privacybeleid van Wakeboard NL. Lees hoe wij omgaan met je persoonsgegevens conform de AVG.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-8">
          Privacybeleid
        </h1>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
          <p className="text-slate-500 text-sm">Laatst bijgewerkt: februari 2026</p>

          <p>
            Wakeboard NL (&ldquo;wij&rdquo;, &ldquo;ons&rdquo;, &ldquo;onze&rdquo;) respecteert je privacy en verwerkt
            persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR).
            Dit privacybeleid legt uit welke gegevens wij verzamelen, waarom en wat je rechten zijn.
          </p>

          <h2>1. Verwerkingsverantwoordelijke</h2>
          <p>
            <strong>[BEDRIJFSNAAM]</strong><br />
            [ADRES]<br />
            KvK-nummer: [KVK-NUMMER]<br />
            E-mail: <a href="mailto:[E-MAILADRES]">[E-MAILADRES]</a>
          </p>

          <h2>2. Welke gegevens verwerken wij?</h2>
          <p>Wij kunnen de volgende persoonsgegevens verwerken:</p>
          <ul>
            <li><strong>Contactgegevens</strong> — naam en e-mailadres, wanneer je contact met ons opneemt.</li>
            <li><strong>Reviewgegevens</strong> — naam (of alias), beoordeling en tekst bij het plaatsen van een review op een wakeboardspot.</li>
            <li><strong>Technische gegevens</strong> — IP-adres, browsertype, apparaatgegevens en paginabezoeken via cookies en analytische diensten.</li>
          </ul>

          <h2>3. Rechtsgrond voor verwerking</h2>
          <p>Wij verwerken persoonsgegevens op basis van:</p>
          <ul>
            <li><strong>Gerechtvaardigd belang</strong> — het verbeteren van onze website en diensten (analytics).</li>
            <li><strong>Toestemming</strong> — wanneer je een review plaatst of contact met ons opneemt.</li>
          </ul>

          <h2>4. Bewaartermijnen</h2>
          <p>
            Wij bewaren je gegevens niet langer dan noodzakelijk voor het doel waarvoor ze zijn verzameld.
            Reviews blijven zichtbaar zolang ze relevant zijn, tenzij je verzoekt deze te verwijderen.
            Contactgegevens worden maximaal 12 maanden na het laatste contact bewaard.
          </p>

          <h2>5. Delen met derden</h2>
          <p>
            Wij verkopen je gegevens niet aan derden. Wij kunnen gegevens delen met:
          </p>
          <ul>
            <li><strong>Hostingproviders</strong> — voor het beschikbaar houden van de website.</li>
            <li><strong>Analytische diensten</strong> — voor het verzamelen van geanonimiseerde gebruiksstatistieken.</li>
          </ul>

          <h2>6. Jouw rechten</h2>
          <p>Op grond van de AVG heb je het recht op:</p>
          <ul>
            <li><strong>Inzage</strong> — opvragen welke gegevens wij van je verwerken.</li>
            <li><strong>Correctie</strong> — onjuiste gegevens laten aanpassen.</li>
            <li><strong>Verwijdering</strong> — je gegevens laten verwijderen.</li>
            <li><strong>Beperking</strong> — de verwerking van je gegevens laten beperken.</li>
            <li><strong>Overdraagbaarheid</strong> — je gegevens in een gangbaar formaat ontvangen.</li>
            <li><strong>Bezwaar</strong> — bezwaar maken tegen de verwerking van je gegevens.</li>
          </ul>
          <p>
            Je kunt je rechten uitoefenen door een e-mail te sturen naar{' '}
            <a href="mailto:[E-MAILADRES]">[E-MAILADRES]</a>. Wij reageren binnen 30 dagen op je verzoek.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Onze website maakt gebruik van cookies. Meer informatie vind je in ons{' '}
            <a href="/cookies">cookiebeleid</a>.
          </p>

          <h2>8. Beveiliging</h2>
          <p>
            Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen
            tegen verlies, misbruik en ongeautoriseerde toegang.
          </p>

          <h2>9. Klachten</h2>
          <p>
            Heb je een klacht over hoe wij met je gegevens omgaan? Neem dan contact met ons op
            via <a href="mailto:[E-MAILADRES]">[E-MAILADRES]</a>. Je hebt ook het recht om een klacht
            in te dienen bij de Autoriteit Persoonsgegevens (
            <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
              autoriteitpersoonsgegevens.nl
            </a>
            ).
          </p>

          <h2>10. Wijzigingen</h2>
          <p>
            Wij kunnen dit privacybeleid van tijd tot tijd aanpassen. De meest actuele versie is altijd
            te vinden op deze pagina.
          </p>
        </div>
      </div>
    </div>
  )
}
