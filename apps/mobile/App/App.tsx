import type { ApiEvent } from '@eggeo/api-client';
import { EGG_DEFAULT_POINTS, appText } from '@eggeo/domain';
import { EggeoAuthPanel, EggeoNavBar, EggeoOfflineBanner, EggeoSkyScene, EggeoText, EggeoTitle, EggeoUIProvider, type AuthPanelMode } from '@eggeo/ui';
import { ComicNeue_700Bold, useFonts } from '@expo-google-fonts/comic-neue';
import { StatusBar } from 'expo-status-bar';
import { Search, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { accountStorage, api } from '../lib/api';
import { getSavedEvents, saveEvents } from '../lib/huntStorage';
import { isNetworkAvailable, isOfflineError, reportOffline } from '../lib/connectivity';
import { useMobileSession } from '../lib/useMobileSession';
import { processOfflineEggQueue, subscribeEggChanges } from '../lib/offlineEggs';
import { styles } from './App.styles';
import { CodesView } from '../views/CodesView';
import { CreateView } from '../views/CreateView';
import { DashboardView } from '../views/DashboardView';
import { FindView } from '../views/FindView';
import { EventsView } from '../views/EventsView';
import { HideView } from '../views/HideView';
import { LeaderboardView } from '../views/LeaderboardView';
import { LocatorView } from '../views/LocatorView';
import { PanelView } from '../views/PanelView';
import { ScoreView } from '../views/ScoreView';
import { type MobilePage, primaryPages } from '../views/routes';

const offlinePages = new Set<MobilePage>(['dashboard', 'find', 'hide', 'locator']);

const noScrollPages = new Set<MobilePage>(['dashboard', 'find', 'locator', 'score', 'create', 'hide']);

export default function App() {
  const [fontsLoaded] = useFonts({ ComicNeue_700Bold });
  const { user, isCheckingSession, isOffline, isSessionVerified, sessionRevision, acceptAccount, forgetAccount } = useMobileSession();
  const activeUsername = useRef<string | null>(null);
  activeUsername.current = user?.username ?? null;
  const [page, setPage] = useState<MobilePage>('dashboard');
  const [authMode, setAuthMode] = useState<AuthPanelMode>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMessage, setAuthMessage] = useState(appText.auth.messages.readyToHunt(EGG_DEFAULT_POINTS));
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isMapFindOpen, setIsMapFindOpen] = useState(false);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [offlineSyncRevision, setOfflineSyncRevision] = useState(0);
  const isSyncingOfflineQueue = useRef(false);
  const eventAccount = useRef<string | null>(null);

  useEffect(() => {
    if (!user || page !== 'locator') {
      setIsMapFindOpen(false);
    }
  }, [page, user?.username]);

  const loadEvents = useCallback(async (preferredEventId?: string) => {
    if (!user) {
      setEvents([]);
      setSelectedEventId('');
      return;
    }

    const username = user.username;
    if (eventAccount.current !== username) {
      eventAccount.current = username;
      setEvents([]);
      setSelectedEventId('');
    }
    setIsLoadingEvents(true);
    try {
      const savedEventId = await accountStorage.getSelectedEvent(username);
      let nextEvents: ApiEvent[];
      if (!(await isNetworkAvailable())) {
        reportOffline(true);
        nextEvents = await getSavedEvents(username) ?? [];
      } else {
        try {
          nextEvents = await api.getEvents();
          await saveEvents(username, nextEvents).catch(() => undefined);
        } catch (error) {
          if (!(await isOfflineError(error))) throw error;
          nextEvents = await getSavedEvents(username) ?? [];
        }
      }
      if (activeUsername.current !== username) return;
      setEvents(nextEvents);
      setSelectedEventId((currentEventId) => {
        const nextEventId = preferredEventId || currentEventId || savedEventId;
        return nextEvents.some((event) => event.id === nextEventId) ? nextEventId : nextEvents[0]?.id || '';
      });
    } catch {
      // Keep the current event list when the network is unavailable.
    } finally {
      if (activeUsername.current === username) setIsLoadingEvents(false);
    }
  }, [user?.username]);

  const syncOfflineEggQueue = useCallback(async () => {
    if (!user || !isSessionVerified || isOffline || isSyncingOfflineQueue.current) {
      return;
    }

    isSyncingOfflineQueue.current = true;

    try {
      const result = await processOfflineEggQueue();

      if (result.completed > 0 || result.failed > 0) {
        setOfflineSyncRevision((revision) => revision + 1);
        await loadEvents();
      }
    } catch {
      // The queue remains stored for the next reconnect.
    } finally {
      isSyncingOfflineQueue.current = false;
    }
  }, [loadEvents, user?.username, isSessionVerified, isOffline]);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setSelectedEventId('');
      return;
    }

    void loadEvents();
    void syncOfflineEggQueue();
  }, [loadEvents, syncOfflineEggQueue, user?.username, sessionRevision]);

  useEffect(() => subscribeEggChanges(() => {
    setOfflineSyncRevision(revision => revision + 1);
  }), []);

  function selectEvent(eventId: string) {
    setSelectedEventId(eventId);
    if (user) void accountStorage.setSelectedEvent(user.username, eventId).catch(() => undefined);
  }

  if (!fontsLoaded || isCheckingSession) {
    return null;
  }

  function navigate(nextPage: MobilePage) {
    setPage(nextPage);
  }

  function renderPage() {
    if ((!isSessionVerified || isOffline) && !offlinePages.has(page)) {
      return <EggeoText>{page === 'panel'
        ? 'You must be logged in online to use account settings. Your saved account is still available for offline hunting.'
        : 'Connect to the internet to use this page.'}</EggeoText>;
    }
    return (
      <>
        {page === 'dashboard' && <DashboardView events={events} offlineSyncRevision={offlineSyncRevision + sessionRevision} selectedEventId={selectedEventId} onSelectEvent={selectEvent} />}
        {page === 'leaderboard' && <LeaderboardView offlineSyncRevision={offlineSyncRevision + sessionRevision} selectedEventId={selectedEventId} />}
        {page === 'events' && <EventsView events={events} isLoading={isLoadingEvents} onEventsChanged={loadEvents} onSelectEvent={selectEvent} />}
        {page === 'find' && <FindView selectedEventId={selectedEventId} offlineSyncRevision={offlineSyncRevision + sessionRevision} onEventsChanged={loadEvents} />}
        {page === 'locator' && <LocatorView offlineSyncRevision={offlineSyncRevision + sessionRevision} selectedEventId={selectedEventId} />}
        {page === 'panel' && user && <PanelView onNavigate={navigate} onSignedOut={forgetAccount} user={user} />}
        {page === 'codes' && <CodesView events={events} selectedEventId={selectedEventId} />}
        {page === 'create' && <CreateView events={events} selectedEventId={selectedEventId} />}
        {page === 'hide' && <HideView selectedEventId={selectedEventId} offlineSyncRevision={offlineSyncRevision + sessionRevision} />}
        {page === 'score' && <ScoreView offlineSyncRevision={offlineSyncRevision + sessionRevision} selectedEventId={selectedEventId} />}
      </>
    );
  }

  async function submitAuth() {
    setIsAuthSubmitting(true);
    setAuthMessage('');

    try {
      if (authMode === 'create') {
        await api.createAccount({ email: authEmail, name: authName || undefined, password: authPassword });
      }

      await api.login({ email: authEmail, password: authPassword });
      const session = await api.getMe();
      if (session.user) {
        setPage('dashboard');
        setIsMapFindOpen(false);
        setAuthPassword('');
        await acceptAccount(session.user);
        return;
      }

      setAuthMessage(appText.auth.messages.sessionNotEstablished);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : appText.auth.messages.requestFailed);
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  return (
    <EggeoUIProvider>
      <View style={styles.safeArea}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
          {user && (
            <EggeoNavBar
              activeKey={page}
              brandLabel={appText.brand.title}
              items={isOffline || !isSessionVerified ? primaryPages.filter(item => offlinePages.has(item.key) || item.key === 'panel') : primaryPages}
              onBrandPress={() => navigate('dashboard')}
              onSelect={(key) => navigate(key as MobilePage)}
            />
          )}
          {(isOffline || (user && !isSessionVerified)) && (
            <EggeoOfflineBanner isSignedIn={Boolean(user)} />
          )}
          <EggeoSkyScene>
            {!user && (
              <View style={styles.authHeader}>
                <EggeoTitle>{appText.brand.title}</EggeoTitle>
              </View>
            )}
            {user ? (
              noScrollPages.has(page) ? (
                <View style={page === 'locator' ? styles.fullPageContent : [styles.fullPageContent, styles.paddedFullPageContent]}>
                  {renderPage()}
                </View>
              ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
                  {renderPage()}
                </ScrollView>
              )
            ) : (
              <View style={styles.authPanelWrap}>
                <EggeoAuthPanel
                  email={authEmail}
                  isSubmitting={isAuthSubmitting}
                  message={authMessage}
                  mode={authMode}
                  name={authName}
                  onChangeEmail={setAuthEmail}
                  onChangeMode={(nextMode) => {
                    setAuthMode(nextMode);
                    setAuthMessage('');
                  }}
                  onChangeName={setAuthName}
                  onChangePassword={setAuthPassword}
                  onSubmit={submitAuth}
                  password={authPassword}
                />
              </View>
            )}
          </EggeoSkyScene>
        </KeyboardAvoidingView>
        {user && page === 'locator' && (
          <Pressable accessibilityLabel="Open QR finder" accessibilityRole="button" onPress={() => setIsMapFindOpen(true)} style={styles.mapFindButton}>
            <Search color="#111111" size={30} strokeWidth={3} />
          </Pressable>
        )}
        <Modal animationType="slide" onRequestClose={() => setIsMapFindOpen(false)} transparent visible={isMapFindOpen}>
          <Pressable onPress={() => setIsMapFindOpen(false)} style={styles.mapFindModalOverlay}>
            <Pressable onPress={(event) => event.stopPropagation()} style={styles.mapFindModalPanel}>
              <View style={styles.mapFindModalHeader}>
                <EggeoTitle style={styles.mapFindModalTitle}>{appText.nav.find}</EggeoTitle>
                <Pressable accessibilityLabel={appText.common.actions.close} accessibilityRole="button" onPress={() => setIsMapFindOpen(false)} style={styles.mapFindCloseButton}>
                  <X color="#111111" size={28} strokeWidth={3} />
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.mapFindModalContent} showsVerticalScrollIndicator={false}>
                <FindView selectedEventId={selectedEventId} offlineSyncRevision={offlineSyncRevision + sessionRevision} showTitle={false} onEventsChanged={loadEvents} />
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </EggeoUIProvider>
  );
}
