import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Algemene voorwaarden',
  description: 'Algemene voorwaarden van Wakeboard NL. Lees de gebruiksvoorwaarden van onze website.',
}

export default function VoorwaardenPage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-8">
          Algemene voorwaarden
        </h1>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
          <p className="text-slate-500 text-sm">Laatst bijgewerkt: februari 2026</p>

          <p>
            Door gebruik te maken van de website wakeboard-nl.nl (&ldquo;de Website&rdquo;), beheerd
            door [BEDRIJFSNAAM], ga je akkoord met deze algemene voorwaarden.
          </p>

          <h2>1. Gebruik van de website</h2>
          <p>
            De Website is een informatief platform over wakeboardlocaties in Nederland. Je mag de
            Website gebruiken voor persoonlijke, niet-commerciële doeleinden. Het is niet toegestaan om:
          </p>
          <ul>
            <li>De Website te gebruiken voor onrechtmatige doeleinden.</li>
            <li>Inhoud van de Website zonder toestemming te kopiëren of verspreiden.</li>
            <li>De werking van de Website te verstoren of te beschadigen.</li>
          </ul>

          <h2>2. Intellectueel eigendom</h2>
          <p>
            Alle inhoud op de Website — waaronder teksten, afbeeldingen, logo&apos;s, ontwerp en
            software — is eigendom van [BEDRIJFSNAAM] of haar licentiegevers en wordt beschermd
            door het auteursrecht en andere intellectuele eigendomsrechten.
          </p>
          <p>
            Zonder voorafgaande schriftelijke toestemming is het niet toegestaan om inhoud van de
            Website te verveelvoudigen, openbaar te maken of te bewerken.
          </p>

          <h2>3. User-generated content (reviews)</h2>
          <p>
            Gebruikers kunnen reviews plaatsen over wakeboardlocaties. Door een review te plaatsen:
          </p>
          <ul>
            <li>Garandeer je dat de inhoud waarheidsgetrouw is en geen inbreuk maakt op rechten van derden.</li>
            <li>Verleen je ons een niet-exclusief, royaltyvrij recht om de review te publiceren op de Website.</li>
            <li>Accepteer je dat wij reviews mogen modereren, bewerken of verwijderen zonder opgave van reden.</li>
          </ul>

          <h2>4. Aansprakelijkheid</h2>
          <p>
            De informatie op de Website wordt met zorg samengesteld, maar wij geven geen garantie op
            de juistheid, volledigheid of actualiteit van de geboden informatie. In het bijzonder:
          </p>
          <ul>
            <li>
              Locatiegegevens (openingstijden, prijzen, faciliteiten) kunnen afwijken van de werkelijkheid.
              Controleer altijd bij de locatie zelf.
            </li>
            <li>
              De Website biedt geen professioneel advies. Gebruik van de informatie is geheel op eigen risico.
            </li>
            <li>
              Wij zijn niet aansprakelijk voor directe of indirecte schade die voortvloeit uit het gebruik
              van de Website of de informatie daarop.
            </li>
          </ul>

          <h2>5. Links naar derden</h2>
          <p>
            De Website kan links bevatten naar websites van derden. Wij hebben geen controle over de
            inhoud of het privacybeleid van deze websites en zijn hiervoor niet verantwoordelijk.
          </p>

          <h2>6. Wijzigingen</h2>
          <p>
            Wij behouden ons het recht voor om deze voorwaarden op elk moment te wijzigen. De meest
            actuele versie is altijd beschikbaar op deze pagina. Bij wezenlijke wijzigingen zullen wij
            dit duidelijk op de Website vermelden.
          </p>

          <h2>7. Toepasselijk recht</h2>
          <p>
            Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de
            bevoegde rechter in Nederland.
          </p>

          <h2>8. Contact</h2>
          <p>
            Vragen over deze voorwaarden? Neem contact met ons op via{' '}
            <a href="mailto:[E-MAILADRES]">[E-MAILADRES]</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
