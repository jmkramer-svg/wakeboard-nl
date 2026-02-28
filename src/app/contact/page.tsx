import type { Metadata } from 'next'
import { Mail, MapPin, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Neem contact op met Wakeboard NL. Vragen, suggesties of opmerkingen? Wij horen graag van je.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Contact
        </h1>
        <p className="text-slate-500 mb-10 text-lg">
          Heb je een vraag, suggestie of opmerking? Neem gerust contact met ons op.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href="mailto:[E-MAILADRES]"
            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-100 transition-colors shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 mb-1">E-mail</h2>
              <p className="text-slate-500 text-sm">[E-MAILADRES]</p>
            </div>
          </a>

          <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 mb-1">Adres</h2>
              <p className="text-slate-500 text-sm">[ADRES]</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 mb-1">KvK-nummer</h2>
              <p className="text-slate-500 text-sm">[KVK-NUMMER]</p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-2">Spot toevoegen of wijzigen?</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Wil je een wakeboardlocatie toevoegen of zijn de gegevens van een bestaande spot niet
            meer actueel? Stuur ons een e-mail en wij passen het zo snel mogelijk aan.
          </p>
        </div>
      </div>
    </div>
  )
}
