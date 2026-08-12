export type LocationInput = {
  lat: number;
  lng: number;
};

export function parseEggFromLink(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/\/egg\/([0-9a-fA-F-]{36})/);
  return match?.[1] ?? trimmed;
}

export function parseEventFromLink(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/\/event\/([0-9a-fA-F-]{36})/);
  return match?.[1] ?? trimmed;
}

export function parseLinkFromEgg(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NUXT_PUBLIC_URL ?? 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}/egg/${id}`;
}

export function parseLinkFromEvent(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NUXT_PUBLIC_URL ?? 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}/event/${id}`;
}

export function parseScanTarget(value: string) {
  const trimmed = value.trim();
  const eggMatch = trimmed.match(/\/egg\/([0-9a-fA-F-]{36})/);
  const eventMatch = trimmed.match(/\/event\/([0-9a-fA-F-]{36})/);

  if (eggMatch?.[1]) return { id: eggMatch[1], type: 'egg' as const };
  if (eventMatch?.[1]) return { id: eventMatch[1], type: 'event' as const };
  return { id: trimmed, type: 'egg' as const };
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function toNumberLocation(location?: { lat?: unknown; lng?: unknown } | null): LocationInput | undefined {
  const lat = typeof location?.lat === 'string' ? Number.parseFloat(location.lat) : location?.lat;
  const lng = typeof location?.lng === 'string' ? Number.parseFloat(location.lng) : location?.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number' || Number.isNaN(lat) || Number.isNaN(lng)) {
    return undefined;
  }

  return { lat, lng };
}

export function displayName(fullName?: string | null) {
  if (!fullName) return 'Anonymous Ninja';

  const [firstName, lastName] = fullName.split(' ');
  const shortFirst = firstName.length < 15 ? firstName : firstName.substring(0, 14);
  const lastInitial = lastName ? ` ${lastName[0]}.` : '';

  return `${shortFirst}${lastInitial}`;
}
