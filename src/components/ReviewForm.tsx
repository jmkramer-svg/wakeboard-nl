'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  spotId: string
}

export default function ReviewForm({ spotId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Geef een beoordeling (1-5 sterren)'); return }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spot_id: spotId, author_name: name, author_email: email || undefined, rating, content }),
    })

    setSubmitting(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Er ging iets mis. Probeer opnieuw.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="font-semibold text-green-800">Bedankt voor je review!</p>
        <p className="text-sm text-green-700 mt-1">Je review wordt beoordeeld voordat deze gepubliceerd wordt.</p>
      </div>
    )
  }

  const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Beoordeling *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hovered || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Naam *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Jouw naam"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail (optioneel)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="jouw@email.nl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Review *</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className={inputClass}
          placeholder="Deel je ervaring met dit spot..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        {submitting ? 'Versturen...' : 'Review versturen'}
      </button>
    </form>
  )
}
