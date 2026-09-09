import { useEffect, useState } from 'react';
import type { ApiScore } from '@eggeo/api-client';
import { accountStorage } from './api';
import { getSavedScore, refreshHuntScore } from './huntStorage';
import { isNetworkAvailable, isOfflineError, reportOffline } from './connectivity';
import { getOfflineEggQueue, subscribeEggChanges, type OfflineEggAction } from './offlineEggs';

// A server snapshot identifies finds already credited, including repeat scans.
export function useHuntScore(eventId: string, revision = 0) {
  const [score, setScore] = useState<{ points: number | null; pending: number; unavailable: boolean }>({
    points: null, pending: 0, unavailable: false,
  });
  useEffect(() => {
    let current = true;
    let request = 0;
    async function refresh() {
      const version = ++request;
      let snapshot: ApiScore | null = null;
      const { user } = await accountStorage.read();
      if (user) {
        if (!(await isNetworkAvailable())) {
          reportOffline(true);
          snapshot = await getSavedScore(user.username, eventId);
        } else {
          try { snapshot = await refreshHuntScore(user.username, eventId); }
          catch (error) {
            if (!(await isOfflineError(error))) throw error;
            snapshot = await getSavedScore(user.username, eventId);
          }
        }
      }
      const queue = await getOfflineEggQueue();
      if (current && version === request) setScore(calculateHuntScore(snapshot, queue, eventId));
    }
    setScore({ points: null, pending: 0, unavailable: false });
    const update = () => { void refresh().catch(() => {
      if (current) setScore({ points: null, pending: 0, unavailable: true });
    }); };
    update();
    const unsubscribe = subscribeEggChanges(update);
    return () => { current = false; unsubscribe(); };
  }, [eventId, revision]);
  return score;
}

export function calculateHuntScore(snapshot: ApiScore | null, queue: OfflineEggAction[], eventId: string) {
  const credited = new Set(snapshot?.foundEggIds ?? []);
  const uniqueFinds = new Map(queue.filter(action => action.type === 'findEgg').map(action => [action.eggId, action]));
  const pending = [...uniqueFinds.values()].filter(action => !credited.has(action.eggId)
    && (!eventId || !action.egg || action.egg.eventId === eventId));
  const knownPoints = pending.reduce((sum, action) => sum + (action.egg?.points ?? 0), 0);
  return {
    // Older servers lack credited IDs; don't guess whether a find is new.
    points: snapshot ? snapshot.points + (snapshot.foundEggIds ? knownPoints : 0) : null,
    pending: pending.length,
    unavailable: snapshot === null,
  };
}
