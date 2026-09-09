import type { ApiSessionUser } from '@eggeo/api-client';
import { isOfflineError } from './connectivity';

type LocalStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
};

const ACCOUNT_KEY = 'eggeo.lastAccount';
export type RememberedAccount = { user: ApiSessionUser | null; signedOut: boolean };

export function createAccountStorage(storage: LocalStorage) {
  return {
    async read(): Promise<RememberedAccount> {
      try {
        const value = JSON.parse(await storage.getItem(ACCOUNT_KEY) ?? 'null');
        if (value?.signedOut === true) return { user: null, signedOut: true };
        if (typeof value?.user?.username === 'string') return { user: value.user, signedOut: false };
      } catch { /* Missing or damaged local state requires an online sign-in. */ }
      return { user: null, signedOut: false };
    },
    async remember(user: ApiSessionUser | null) {
      // Persist only profile information. Passwords and session cookies are not stored here.
      const profile = user ? { username: user.username, email: user.email, name: user.name } : null;
      await storage.setItem(ACCOUNT_KEY, JSON.stringify({ user: profile, signedOut: user === null }));
    },
    async getSelectedEvent(username: string) {
      return await storage.getItem(`eggeo.selectedEvent.${username}`).catch(() => null) ?? '';
    },
    async setSelectedEvent(username: string, eventId: string) {
      await storage.setItem(`eggeo.selectedEvent.${username}`, eventId);
    },
  };
}

export async function resolveAccount(remembered: RememberedAccount, getSession: () => Promise<{ user: ApiSessionUser | null }>) {
  if (remembered.signedOut) return { user: null, offline: false, remember: false };
  try {
    const { user } = await getSession();
    return { user, offline: false, remember: true };
  } catch (error) {
    if (await isOfflineError(error)) {
      return { user: remembered.user, offline: true, remember: false };
    }
    return { user: null, offline: false, remember: true };
  }
}
