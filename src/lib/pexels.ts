export interface PexelsPhoto {
  url: string
  alt: string
  photographer: string
  photographerUrl: string
}

export async function searchPexelsPhotos(
  query: string,
  count: number = 2
): Promise<PexelsPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return []

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  )

  if (!res.ok) return []

  const data = await res.json()

  return (data.photos ?? []).map((photo: Record<string, unknown>) => ({
    url: (photo.src as Record<string, string>).large2x,
    alt: (photo.alt as string) || query,
    photographer: photo.photographer as string,
    photographerUrl: photo.photographer_url as string,
  }))
}
