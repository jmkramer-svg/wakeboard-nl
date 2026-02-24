'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  bucket: 'spot-images' | 'article-images'
}

export default function ImageUploader({ value, onChange, bucket }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setError('')
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Afbeelding preview"
            className="h-40 w-full object-cover rounded-lg border border-slate-200"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-sm text-slate-500 hover:border-blue-300 hover:text-blue-500 transition-colors disabled:opacity-50"
        >
          <Upload className="w-5 h-5" />
          {uploading ? 'Uploading...' : 'Klik om afbeelding te uploaden'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
