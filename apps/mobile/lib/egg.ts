export function getEggCode(value: string) {
  const match = value.trim().match(/\/egg\/([0-9a-fA-F-]{36})/);
  return match?.[1] ?? value.trim();
}

export function getEventCode(value: string) {
  const match = value.trim().match(/\/event\/([0-9a-fA-F-]{36})/);
  return match?.[1] ?? value.trim();
}

export function parseLinkFromEgg(id: string) {
  const baseUrl = process.env.EXPO_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}/egg/${id}`;
}

export function parseLinkFromEvent(id: string) {
  const baseUrl = process.env.EXPO_PUBLIC_APP_URL ?? 'http://localhost:3000';
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
