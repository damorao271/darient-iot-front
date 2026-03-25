/**
 * Static cover images for places (served from /public/places/).
 * Maps backend place ids to filenames; unknown ids get a stable image via hash.
 * Replace SVGs with your own PNGs (place-1.png … place-5.png) if desired — same paths work with .png.
 */
const PLACE_IMAGE_BY_ID: Record<string, number> = {
  'place-1': 1,
  'place-2': 2,
  'place-3': 3,
  'place-4': 4,
  'place-5': 5,
}

const IMAGE_COUNT = 5

function hashPlaceId(placeId: string): number {
  let h = 0
  for (let i = 0; i < placeId.length; i += 1) {
    h = (Math.imul(31, h) + placeId.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function getPlaceCoverSrc(placeId: string): string {
  const index =
    PLACE_IMAGE_BY_ID[placeId] ?? (hashPlaceId(placeId) % IMAGE_COUNT) + 1
  return `/places/place-${index}.png`
}

/** Prefer API `imageUrl` when present; otherwise static mapping by place id. */
export function resolvePlaceCoverSrc(place: {
  id: string
  imageUrl?: string | undefined
}): string {
  return place.imageUrl ?? getPlaceCoverSrc(place.id)
}
