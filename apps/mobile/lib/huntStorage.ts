import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiEvent, ApiScore } from '@eggeo/api-client';
import { api, API_BASE_URL } from './api';

function scoreKey(username: string, eventId: string) {
  return `eggeo.scores.${encodeURIComponent(username)}.${eventId || 'all'}`;
}

// Keep data saved by earlier builds available on the first offline launch.
async function readSaved<T>(key: string, username: string, legacyPath: string): Promise<T | null> {
  const legacyKey = `eggeo.readCache.${encodeURIComponent(username)}.${API_BASE_URL.replace(/\/$/, '')}${legacyPath}`;
  const value = await AsyncStorage.getItem(key) ?? await AsyncStorage.getItem(legacyKey);
  try { return value ? JSON.parse(value) as T : null; } catch { return null; }
}

export function getSavedEvents(username: string) {
  return readSaved<ApiEvent[]>(`eggeo.events.${encodeURIComponent(username)}`, username, '/api/events');
}

export async function saveEvents(username: string, events: ApiEvent[]) {
  await AsyncStorage.setItem(`eggeo.events.${encodeURIComponent(username)}`, JSON.stringify(events));
}

export function getSavedScore(username: string, eventId: string) {
  return readSaved<ApiScore>(scoreKey(username, eventId), username,
    `/api/score${eventId ? `?eventId=${encodeURIComponent(eventId)}` : ''}`);
}

let sequence = 0;
const savedVersions = new Map<string, number>();
let scoreWrite: Promise<unknown> = Promise.resolve();

// Always uses the server. Queue sync must confirm and save the score before
// removing a pending find; a failed refresh leaves that find queued for retry.
export async function refreshHuntScore(username: string, eventId: string) {
  const version = ++sequence;
  const score = await api.getScore(eventId || undefined);
  const key = scoreKey(username, eventId);
  const write = scoreWrite.catch(() => undefined).then(async () => {
    if ((savedVersions.get(key) ?? 0) >= version) return;
    await AsyncStorage.setItem(key, JSON.stringify(score));
    savedVersions.set(key, version);
  });
  scoreWrite = write;
  await write;
  return score;
}
