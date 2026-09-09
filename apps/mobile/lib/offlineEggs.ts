import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiEgg } from '@eggeo/api-client';
import { accountStorage, api } from './api';
import { refreshHuntScore } from './huntStorage';
import { isNetworkAvailable, isOfflineError } from './connectivity';
export { isNetworkAvailable, isOfflineError } from './connectivity';

const EGG_KEY_PREFIX = 'eggeo.eggDetails.';
const CACHE_KEY_PREFIX = 'eggeo.nearbyEggs.';
const QUEUE_KEY = 'eggeo.offlineEggQueue';
const MAX_RETRY_ATTEMPTS = 5;

export type OfflineEggActionType = 'collectEgg' | 'findEgg' | 'hideEgg';

export type OfflineEggAction = {
  attempts: number;
  createdAt: number;
  eggId: string;
  id: string;
  lastError?: string;
  egg?: ApiEgg;
  coords?: { lat: number; lng: number };
  type: OfflineEggActionType;
};

export type OfflineQueueResult = {
  completed: number;
  failed: number;
  remaining: number;
};

type CachedEggsPayload = {
  eggs: ApiEgg[];
  savedAt: number;
};

function cacheKey(eventId: string) {
  return `${CACHE_KEY_PREFIX}${eventId}`;
}

function actionKey(type: OfflineEggActionType, eggId: string) {
  return `${type}:${eggId}`;
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Request failed.';
}

export async function getCachedNearbyEggs(eventId: string) {
  const payload = parseJson<CachedEggsPayload | null>(await AsyncStorage.getItem(cacheKey(eventId)), null);

  return applyQueuedEggActions(eventId, payload?.eggs ?? []);
}

export async function cacheEgg(egg: ApiEgg) {
  await AsyncStorage.setItem(`${EGG_KEY_PREFIX}${egg.id}`, JSON.stringify(egg));
}

export async function getCachedEgg(eggId: string) {
  const saved = parseJson<ApiEgg | null>(await AsyncStorage.getItem(`${EGG_KEY_PREFIX}${eggId}`), null);
  if (saved) return saved;
  const keys = (await AsyncStorage.getAllKeys()).filter(key => key.startsWith(CACHE_KEY_PREFIX));
  const cached = await AsyncStorage.multiGet(keys);
  for (const [, value] of cached) {
    const payload = parseJson<CachedEggsPayload | null>(value, null);
    const egg = payload?.eggs.find(egg => egg.id === eggId);
    if (egg) return egg;
  }
  return null;
}

export async function setCachedNearbyEggs(eventId: string, eggs: ApiEgg[]) {
  const payload: CachedEggsPayload = {
    eggs,
    savedAt: Date.now(),
  };

  await AsyncStorage.setItem(cacheKey(eventId), JSON.stringify(payload));
  await Promise.all(eggs.map(cacheEgg));
}

export async function getOfflineEggQueue() {
  return parseJson<OfflineEggAction[]>(await AsyncStorage.getItem(QUEUE_KEY), []);
}

export async function clearOfflineEggStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const eggeoKeys = keys.filter((key) => key.startsWith(EGG_KEY_PREFIX) || key === QUEUE_KEY || key.startsWith(CACHE_KEY_PREFIX) || key.startsWith('eggeo.scores.') || key.startsWith('eggeo.events.') || key.startsWith('eggeo.readCache.') || key.startsWith('eggeo.selectedEvent.'));

  if (eggeoKeys.length > 0) {
    await AsyncStorage.multiRemove(eggeoKeys);
  }
}

const listeners = new Set<() => void>();
export function subscribeEggChanges(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function notifyEggChanges() { listeners.forEach(listener => listener()); }

export async function applyQueuedEggActions(eventId: string, eggs: ApiEgg[]) {
  const visible = new Map(eggs.map(egg => [egg.id, egg]));
  for (const action of await getOfflineEggQueue()) {
    if (action.type === 'collectEgg') visible.delete(action.eggId);
    if (action.type === 'hideEgg' && action.coords && action.egg?.eventId === eventId) {
      visible.set(action.eggId, { ...action.egg, coords: action.coords, isCollected: false });
    }
  }
  return [...visible.values()];
}

let queueWrite: Promise<unknown> = Promise.resolve();

function updateOfflineQueue(update: (queue: OfflineEggAction[]) => OfflineEggAction[]) {
  const write = queueWrite.catch(() => undefined).then(async () => {
    const next = update(await getOfflineEggQueue());
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
    notifyEggChanges();
    return next.length;
  });
  queueWrite = write;
  return write;
}

export async function enqueueOfflineEggAction(type: OfflineEggActionType, eggId: string, details: {
  egg?: ApiEgg; coords?: { lat: number; lng: number };
} = {}) {
  const egg = details.egg ?? await getCachedEgg(eggId) ?? undefined;
  return updateOfflineQueue(queue => {
    const id = actionKey(type, eggId);
    if (type === 'findEgg' && queue.some(action => action.id === id)) return queue;
    return [...queue.filter(action => action.id !== id), {
      attempts: 0, createdAt: Math.max(Date.now(), ...queue.map(action => action.createdAt + 1)), eggId, id, type, ...details, egg,
    }];
  });
}

async function runOfflineAction(action: OfflineEggAction, username: string) {
  if (action.type === 'findEgg') {
    const result = await api.findEgg(action.eggId);
    await cacheEgg(result.Egg);
    // Refresh both score caches before removing the optimistic find. If this
    // fails, retrying find is safe because the server upserts by egg/user.
    await refreshHuntScore(username, '');
    if (result.Egg.eventId) await refreshHuntScore(username, result.Egg.eventId);
    return;
  }

  if (action.type === 'hideEgg') {
    if (!action.coords) throw new Error('Missing hide coordinates.');
    await api.hideEgg(action.eggId, action.coords);
    return;
  }
  await api.collectEgg(action.eggId);
}

export async function processOfflineEggQueue(): Promise<OfflineQueueResult> {
  const queue = await getOfflineEggQueue();
  const { user } = await accountStorage.read();
  if (!user) return { completed: 0, failed: 0, remaining: queue.length };

  if (queue.length === 0) {
    return { completed: 0, failed: 0, remaining: 0 };
  }

  if (!(await isNetworkAvailable().catch(() => false))) {
    return { completed: 0, failed: 0, remaining: queue.length };
  }

  let completed = 0;
  let failed = 0;
  const remaining: OfflineEggAction[] = [];

  for (let index = 0; index < queue.length; index += 1) {
    const action = queue[index];

    try {
      await runOfflineAction(action, user.username);
      // Persist the final marker state before removing its queued overlay.
      if (action.type !== 'findEgg') {
        const knownEgg = action.egg ?? await getCachedEgg(action.eggId);
        const keys = (await AsyncStorage.getAllKeys()).filter(key => key.startsWith(CACHE_KEY_PREFIX));
        for (const key of keys) {
          const payload = parseJson<CachedEggsPayload | null>(await AsyncStorage.getItem(key), null);
          if (!payload) continue;
          const eggs = payload.eggs.filter(egg => egg.id !== action.eggId);
          if (action.type === 'hideEgg' && knownEgg?.eventId === key.slice(CACHE_KEY_PREFIX.length)) {
            eggs.push({ ...knownEgg!, coords: action.coords, isCollected: false });
          }
          await AsyncStorage.setItem(key, JSON.stringify({ ...payload, eggs }));
        }
      }
      completed += 1;
    } catch (error) {
      const nextAction = {
        ...action,
        attempts: action.attempts + 1,
        lastError: errorMessage(error),
      };

      if (await isOfflineError(error)) {
        remaining.push(nextAction, ...queue.slice(index + 1));
        break;
      }

      if (nextAction.attempts < MAX_RETRY_ATTEMPTS) {
        remaining.push(nextAction, ...queue.slice(index + 1));
        break;
      } else {
        failed += 1;
      }
    }
  }

  const attemptedIds = new Set(queue.map(action => `${action.id}:${action.createdAt}`));
  const remainingCount = await updateOfflineQueue(current => [
    ...remaining.filter(action => !current.some(next => next.id === action.id && next.createdAt > action.createdAt)),
    ...current.filter(action => !attemptedIds.has(`${action.id}:${action.createdAt}`)),
  ]);

  return { completed, failed, remaining: remainingCount };
}
