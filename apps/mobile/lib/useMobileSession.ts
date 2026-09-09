import { ApiNetworkError, type ApiSessionUser } from '@eggeo/api-client';
import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { accountStorage, api } from './api';
import { isNetworkAvailable, subscribeOfflineStatus } from './connectivity';
import { resolveAccount } from './accountStorage';

export function useMobileSession() {
  const [user, setUser] = useState<ApiSessionUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isSessionVerified, setIsSessionVerified] = useState(false);
  const [sessionRevision, setSessionRevision] = useState(0);
  const generation = useRef(0);
  const refreshing = useRef<number | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const revision = generation.current;
    if (refreshing.current === revision) return;
    refreshing.current = revision;
    const isCurrent = () => mounted.current && revision === generation.current;
    try {
      const remembered = await accountStorage.read();
      if (!isCurrent() || remembered.signedOut) return;
      const resolved = await resolveAccount(remembered, async () => {
        if (!(await isNetworkAvailable())) throw new ApiNetworkError();
        return api.getMe();
      });
      if (!isCurrent()) return;
      if (resolved.remember) await accountStorage.remember(resolved.user);
      if (!isCurrent()) return;
      setUser(resolved.user);
      setIsSessionVerified(!resolved.offline && resolved.user !== null);
      setIsOffline(resolved.offline);
      if (!resolved.offline) setSessionRevision(value => value + 1);
    } finally {
      if (refreshing.current === revision) refreshing.current = null;
      if (isCurrent()) setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    let wasOffline: boolean | undefined;
    const unsubscribeNetwork = NetInfo.addEventListener(state => {
      const offline = state.isConnected === false || state.isInternetReachable === false;
      if (offline) {
        setIsOffline(true);
        setIsSessionVerified(false);
      }
      if (!offline && wasOffline !== false) {
        if (wasOffline === true) setIsOffline(false);
        void refresh();
      }
      wasOffline = offline;
    });
    const unsubscribeRequests = subscribeOfflineStatus(offline => {
      setIsOffline(offline);
      if (offline) setIsSessionVerified(false);
    });
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') void refresh();
    });
    return () => {
      mounted.current = false;
      generation.current += 1;
      unsubscribeNetwork();
      unsubscribeRequests();
      subscription.remove();
    };
  }, [refresh]);

  useEffect(() => {
    if (!isOffline && (!user || isSessionVerified)) return;
    const timer = setInterval(() => {
      if (AppState.currentState === 'active') void refresh();
    }, 15000);
    return () => clearInterval(timer);
  }, [isOffline, isSessionVerified, user?.username, refresh]);

  const acceptAccount = useCallback(async (account: ApiSessionUser) => {
    generation.current += 1;
    await accountStorage.remember(account);
    setUser(account);
    setIsSessionVerified(true);
    setIsOffline(false);
    setIsCheckingSession(false);
    setSessionRevision(value => value + 1);
  }, []);

  const forgetAccount = useCallback(async () => {
    generation.current += 1;
    await accountStorage.remember(null);
    setUser(null);
    setIsSessionVerified(false);
  }, []);

  return { user, isCheckingSession, isOffline, isSessionVerified, sessionRevision, acceptAccount, forgetAccount };
}
