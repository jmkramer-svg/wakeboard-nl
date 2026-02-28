export interface PexelsPhoto {
  url: string
  alt: string
  photographer: string
  photographerUrl: string
}

// Curated list of verified wakeboarding photos (manually checked)
const CURATED_PHOTOS: PexelsPhoto[] = [
  {
    url: 'https://images.pexels.com/photos/9965345/pexels-photo-9965345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Vrouw aan het wakeboarden op een meer op een zonnige zomerdag',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/9967340/pexels-photo-9967340.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Vrouw aan het wakeboarden op een zonnige dag met opspattend water',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/9953816/pexels-photo-9953816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Wakeboarder voert een trick uit boven een meer',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/9951439/pexels-photo-9951439.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Vader helpt zijn dochter met voorbereidingen voor het wakeboarden',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/9967370/pexels-photo-9967370.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Vrouw geniet van wakeboarden op een meer omringd door groen',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/10064096/pexels-photo-10064096.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Wakeboarder doet tricks met opspattend water',
    photographer: 'Karolina Grabowska',
    photographerUrl: 'https://www.pexels.com/@karolina-grabowska',
  },
  {
    url: 'https://images.pexels.com/photos/14772272/pexels-photo-14772272.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Man aan het wakeboarden en springt boven het water',
    photographer: 'Patrick Case',
    photographerUrl: 'https://www.pexels.com/@patrickkcase',
  },
  {
    url: 'https://images.pexels.com/photos/9953817/pexels-photo-9953817.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Wakeboarder voert een aerial trick uit boven een meer op een zonnige dag',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/9963938/pexels-photo-9963938.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Man geniet van een wakeboard sessie op een rustig meer',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
  {
    url: 'https://images.pexels.com/photos/14046527/pexels-photo-14046527.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Man voert een aerial wakeboard trick uit boven een meer',
    photographer: 'Brett Sayles',
    photographerUrl: 'https://www.pexels.com/@brett-sayles',
  },
  {
    url: 'https://images.pexels.com/photos/17206437/pexels-photo-17206437.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Persoon aan het wakeboarden op een meer, vol actie en avontuur',
    photographer: 'Ollie Craig',
    photographerUrl: 'https://www.pexels.com/@olliecraig',
  },
  {
    url: 'https://images.pexels.com/photos/9967341/pexels-photo-9967341.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Vrouwelijke wakeboarder navigeert over het water omringd door groen',
    photographer: 'Ron Lach',
    photographerUrl: 'https://www.pexels.com/@ron-lach',
  },
]

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function searchPexelsPhotos(
  _query: string,
  count: number = 2
): Promise<PexelsPhoto[]> {
  // Return random selection from curated, verified wakeboarding photos
  return shuffle(CURATED_PHOTOS).slice(0, count)
}
