import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookiebeleid',
  description: 'Cookiebeleid van Wakeboard NL. Lees welke cookies wij gebruiken en waarvoor.',
}

export default function CookiesPage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-8">
          Cookiebeleid
        </h1>

        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
          <p className="text-slate-500 text-sm">Laatst bijgewerkt: februari 2026</p>

          <p>
            Wakeboard NL maakt gebruik van cookies om de website goed te laten functioneren en om het
            gebruik van de website te analyseren. In dit cookiebeleid leggen wij uit welke cookies wij
            gebruiken en waarvoor.
          </p>

          <h2>Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekstbestanden die door je browser op je apparaat worden opgeslagen
            wanneer je een website bezoekt. Ze helpen de website om je te herkennen en je voorkeuren
            te onthouden.
          </p>

          <h2>Welke cookies gebruiken wij?</h2>

          <h3>Functionele cookies</h3>
          <p>
            Deze cookies zijn noodzakelijk voor het goed functioneren van de website. Zonder deze
            cookies kan de website niet correct werken. Voorbeelden:
          </p>
          <ul>
            <li>Sessiebeheer en authenticatie (admin-omgeving)</li>
            <li>Onthouden van cookie-voorkeuren</li>
          </ul>

          <h3>Analytische cookies</h3>
          <p>
            Wij gebruiken analytische cookies om te begrijpen hoe bezoekers de website gebruiken.
            Deze gegevens helpen ons om de website te verbeteren. De gegevens worden zoveel mogelijk
            geanonimiseerd.
          </p>
          <ul>
            <li>Aantal bezoekers en paginaweergaven</li>
            <li>Welke pagina&apos;s het meest bezocht worden</li>
            <li>Hoe bezoekers de website bereiken (zoekmachine, directe link, etc.)</li>
          </ul>

          <h2>Cookies van derden</h2>
          <p>
            Wij kunnen cookies van derde partijen gebruiken, zoals analytische diensten. Deze partijen
            kunnen hun eigen privacybeleid hanteren. Wij raden je aan om het privacybeleid van deze
            partijen te raadplegen.
          </p>

          <h2>Cookies uitschakelen</h2>
          <p>
            Je kunt cookies uitschakelen via de instellingen van je browser. Hieronder vind je
            instructies voor de meestgebruikte browsers:
          </p>
          <ul>
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                Google Chrome
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen" target="_blank" rel="noopener noreferrer">
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/nl-nl/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                Safari
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/nl-nl/microsoft-edge/cookies-verwijderen-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            Let op: het uitschakelen van cookies kan de werking van de website beïnvloeden. Functionele
            cookies zijn noodzakelijk voor een goed werkende website.
          </p>

          <h2>Wijzigingen</h2>
          <p>
            Wij kunnen dit cookiebeleid van tijd tot tijd aanpassen. De meest actuele versie is altijd
            beschikbaar op deze pagina.
          </p>

          <h2>Vragen?</h2>
          <p>
            Heb je vragen over ons cookiebeleid? Neem dan contact met ons op via{' '}
            <a href="mailto:[E-MAILADRES]">[E-MAILADRES]</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
