import { ApiError, ApiNetworkError } from '@eggeo/api-client';
import NetInfo from '@react-native-community/netinfo';

const listeners = new Set<(offline: boolean) => void>();
export function reportOffline(offline: boolean) {
  listeners.forEach(listener => listener(offline));
}
export function subscribeOfflineStatus(listener: (offline: boolean) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export async function isNetworkAvailable() {
  const state = await NetInfo.fetch().catch(() => null);
  return state !== null && state.isConnected !== false && state.isInternetReachable !== false;
}

export async function isOfflineError(error: unknown) {
  // Rejected credentials and other client errors must not restore saved data.
  const offline = error instanceof ApiError ? error.status >= 500
    : error instanceof ApiNetworkError || !(await isNetworkAvailable());
  if (offline) reportOffline(true);
  return offline;
}
