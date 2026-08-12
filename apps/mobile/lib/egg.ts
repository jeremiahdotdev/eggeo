export function getEggCode(value: string) {
  const match = value.trim().match(/\/egg\/([0-9a-fA-F-]{36})/);
  return match?.[1] ?? value.trim();
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
