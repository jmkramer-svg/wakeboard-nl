import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer van Wakeboard NL. Lees onze aansprakelijkheidsbeperking.',
}

export default function DisclaimerPage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-8">
          Disclaimer
        </h1>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
          <p className="text-slate-500 text-sm">Laatst bijgewerkt: februari 2026</p>

          <h2>Informatief platform</h2>
          <p>
            Wakeboard NL is een informatief platform dat als doel heeft om een overzicht te bieden
            van wakeboardlocaties in Nederland. De informatie op deze website is met zorg samengesteld,
            maar is uitsluitend bedoeld ter algemene informatie.
          </p>

          <h2>Geen garantie op juistheid</h2>
          <p>
            Wij doen ons best om de informatie op de website actueel en correct te houden, maar
            kunnen geen garantie geven op de juistheid, volledigheid of actualiteit van de
            gepubliceerde informatie. Dit geldt in het bijzonder voor:
          </p>
          <ul>
            <li>Openingstijden en beschikbaarheid van wakeboardlocaties</li>
            <li>Prijzen en tarieven</li>
            <li>Faciliteiten en voorzieningen</li>
            <li>Contactgegevens van locaties</li>
            <li>Reviews en beoordelingen van gebruikers</li>
          </ul>
          <p>
            Wij raden je aan om altijd contact op te nemen met de betreffende locatie voor de meest
            actuele informatie.
          </p>

          <h2>Geen professioneel advies</h2>
          <p>
            De inhoud van deze website vormt geen professioneel advies. Wakeboarden is een sport
            waarbij letsel kan optreden. Neem altijd de veiligheidsinstructies van de locatie in acht
            en zorg voor passende beschermingsmiddelen.
          </p>

          <h2>Aansprakelijkheid</h2>
          <p>
            Wakeboard NL is niet aansprakelijk voor enige directe of indirecte schade die voortvloeit
            uit of verband houdt met:
          </p>
          <ul>
            <li>Het gebruik van informatie op deze website</li>
            <li>De onmogelijkheid om de website te gebruiken</li>
            <li>Onjuiste of onvolledige informatie op de website</li>
            <li>Handelen of nalaten op basis van informatie op de website</li>
          </ul>

          <h2>Links naar externe websites</h2>
          <p>
            De website kan hyperlinks bevatten naar websites van derden. Wakeboard NL heeft geen
            invloed op de inhoud van deze websites en aanvaardt geen aansprakelijkheid voor de inhoud,
            het privacybeleid of de beschikbaarheid van deze externe websites.
          </p>

          <h2>Wijzigingen</h2>
          <p>
            Wakeboard NL behoudt zich het recht voor om de inhoud van deze disclaimer op elk moment
            te wijzigen zonder voorafgaande kennisgeving.
          </p>

          <h2>Vragen?</h2>
          <p>
            Heb je vragen over deze disclaimer? Neem dan contact met ons op via{' '}
            <a href="mailto:[E-MAILADRES]">[E-MAILADRES]</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
