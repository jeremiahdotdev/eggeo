export function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
}
