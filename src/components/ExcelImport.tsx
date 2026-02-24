'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { Spot } from '@/types'

type ImportRow = Omit<Spot, 'id' | 'created_at' | 'updated_at'>

function parseRow(row: Record<string, unknown>): ImportRow | null {
  const name = String(row['name'] ?? row['naam'] ?? '')
  if (!name) return null

  return {
    name,
    slug: slugify(name),
    description: String(row['description'] ?? row['beschrijving'] ?? ''),
    province: String(row['province'] ?? row['provincie'] ?? 'Noord-Holland') as Spot['province'],
    city: String(row['city'] ?? row['stad'] ?? ''),
    address: String(row['address'] ?? row['adres'] ?? '') || null,
    latitude: parseFloat(String(row['latitude'] ?? row['lat'] ?? '52.3')) || 52.3,
    longitude: parseFloat(String(row['longitude'] ?? row['lng'] ?? '5.3')) || 5.3,
    type: (String(row['type'] ?? 'kabel')) as Spot['type'],
    difficulty: (String(row['difficulty'] ?? row['niveau'] ?? 'alle niveaus')) as Spot['difficulty'],
    website: String(row['website'] ?? '') || null,
    phone: String(row['phone'] ?? row['telefoon'] ?? '') || null,
    email: String(row['email'] ?? '') || null,
    image_url: String(row['image_url'] ?? '') || null,
    features: [],
    obstacles: [],
    price_info: String(row['price_info'] ?? row['prijs'] ?? '') || null,
    opening_hours: String(row['opening_hours'] ?? row['openingstijden'] ?? '') || null,
    is_published: false,
  }
}

export default function ExcelImport() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success?: number; error?: string } | null>(null)

  async function handleFile(file: File) {
    const XLSX = await import('xlsx')
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
    const parsed = data.map(parseRow).filter((r): r is ImportRow => r !== null)
    setRows(parsed)
    setResult(null)
  }

  async function handleImport() {
    if (rows.length === 0) return
    setImporting(true)
    const supabase = createClient()
    const { error } = await supabase.from('spots').insert(rows)
    setImporting(false)
    if (error) {
      setResult({ error: error.message })
    } else {
      setResult({ success: rows.length })
      setRows([])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Excel bestand laden (.xlsx / .xls)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>

      {rows.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 font-medium">{rows.length} spot(s) gevonden in bestand:</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {['Naam', 'Stad', 'Provincie', 'Type'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-slate-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-slate-900">{row.name}</td>
                    <td className="px-3 py-2 text-slate-500">{row.city}</td>
                    <td className="px-3 py-2 text-slate-500">{row.province}</td>
                    <td className="px-3 py-2 text-slate-500">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 10 && (
              <p className="px-3 py-2 text-xs text-slate-400 border-t border-slate-100">
                + {rows.length - 10} meer...
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {importing ? 'Importeren...' : `${rows.length} spots importeren`}
          </button>
        </div>
      )}

      {result?.success && (
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          {result.success} spots succesvol geïmporteerd.
        </div>
      )}
      {result?.error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {result.error}
        </div>
      )}
    </div>
  )
}
