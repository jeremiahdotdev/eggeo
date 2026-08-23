import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type { ApiEgg } from '@eggeo/api-client';
import { api } from './api';

const CACHE_KEY_PREFIX = 'eggeo.nearbyEggs.';
const QUEUE_KEY = 'eggeo.offlineEggQueue';
const MAX_RETRY_ATTEMPTS = 5;

export type OfflineEggActionType = 'collectEgg' | 'findEgg';

export type OfflineEggAction = {
  attempts: number;
  createdAt: number;
  eggId: string;
  id: string;
  lastError?: string;
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

export async function isNetworkAvailable() {
  const state = await NetInfo.fetch();

  return state.isConnected === true && state.isInternetReachable !== false;
}

export async function isOfflineError(error?: unknown) {
  const message = errorMessage(error).toLowerCase();

  if (message.includes('network request failed') || message.includes('failed to fetch')) {
    return true;
  }

  return !(await isNetworkAvailable().catch(() => false));
}

export async function getCachedNearbyEggs(eventId: string) {
  const payload = parseJson<CachedEggsPayload | null>(await AsyncStorage.getItem(cacheKey(eventId)), null);

  return payload?.eggs ?? [];
}

export async function setCachedNearbyEggs(eventId: string, eggs: ApiEgg[]) {
  const payload: CachedEggsPayload = {
    eggs,
    savedAt: Date.now(),
  };

  await AsyncStorage.setItem(cacheKey(eventId), JSON.stringify(payload));
}

export async function getOfflineEggQueue() {
  return parseJson<OfflineEggAction[]>(await AsyncStorage.getItem(QUEUE_KEY), []);
}

export async function clearOfflineEggStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const eggeoKeys = keys.filter((key) => key === QUEUE_KEY || key.startsWith(CACHE_KEY_PREFIX));

  if (eggeoKeys.length > 0) {
    await AsyncStorage.multiRemove(eggeoKeys);
  }
}

async function setOfflineEggQueue(queue: OfflineEggAction[]) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function enqueueOfflineEggAction(type: OfflineEggActionType, eggId: string) {
  const queue = await getOfflineEggQueue();
  const id = actionKey(type, eggId);

  if (queue.some((action) => action.id === id)) {
    return queue.length;
  }

  const nextQueue = [
    ...queue,
    {
      attempts: 0,
      createdAt: Date.now(),
      eggId,
      id,
      type,
    },
  ];

  await setOfflineEggQueue(nextQueue);

  return nextQueue.length;
}

async function runOfflineAction(action: OfflineEggAction) {
  if (action.type === 'findEgg') {
    await api.findEgg(action.eggId);
    return;
  }

  await api.collectEgg(action.eggId);
}

export async function processOfflineEggQueue(): Promise<OfflineQueueResult> {
  const queue = await getOfflineEggQueue();

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
      await runOfflineAction(action);
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
        remaining.push(nextAction);
      } else {
        failed += 1;
      }
    }
  }

  await setOfflineEggQueue(remaining);

  return { completed, failed, remaining: remaining.length };
}
