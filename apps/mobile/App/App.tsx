import type { ApiEvent, ApiSessionUser } from '@eggeo/api-client';
import { EGG_DEFAULT_POINTS, appText } from '@eggeo/domain';
import { EggeoAuthPanel, EggeoNavBar, EggeoSkyScene, EggeoTitle, EggeoUIProvider, type AuthPanelMode } from '@eggeo/ui';
import NetInfo from '@react-native-community/netinfo';
import { ComicNeue_700Bold, useFonts } from '@expo-google-fonts/comic-neue';
import { StatusBar } from 'expo-status-bar';
import { Search, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { api } from '../lib/api';
import { processOfflineEggQueue } from '../lib/offlineEggs';
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

const noScrollPages = new Set<MobilePage>(['dashboard', 'find', 'locator', 'panel', 'score', 'create', 'hide']);

export default function App() {
  const [fontsLoaded] = useFonts({ ComicNeue_700Bold });
  const [user, setUser] = useState<ApiSessionUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    api
      .getMe()
      .then((session) => {
        if (isMounted) {
          setUser(session.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (page !== 'locator') {
      setIsMapFindOpen(false);
    }
  }, [page]);

  const loadEvents = useCallback(async (preferredEventId?: string) => {
    if (!user) {
      setEvents([]);
      setSelectedEventId('');
      return;
    }

    setIsLoadingEvents(true);
    try {
      const nextEvents = await api.getEvents();
      setEvents(nextEvents);
      setSelectedEventId((currentEventId) => {
        const nextEventId = preferredEventId || currentEventId;
        return nextEvents.some((event) => event.id === nextEventId) ? nextEventId : nextEvents[0]?.id || '';
      });
    } catch {
      setEvents([]);
      setSelectedEventId('');
    } finally {
      setIsLoadingEvents(false);
    }
  }, [user]);

  const syncOfflineEggQueue = useCallback(async () => {
    if (!user || isSyncingOfflineQueue.current) {
      return;
    }

    isSyncingOfflineQueue.current = true;

    try {
      const result = await processOfflineEggQueue();

      if (result.completed > 0 || result.failed > 0) {
        setOfflineSyncRevision((revision) => revision + 1);
        await loadEvents();
      }
    } finally {
      isSyncingOfflineQueue.current = false;
    }
  }, [loadEvents, user]);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setSelectedEventId('');
      return;
    }

    void loadEvents();
    void syncOfflineEggQueue();
  }, [loadEvents, syncOfflineEggQueue, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    return NetInfo.addEventListener((state) => {
      if (state.isConnected === true && state.isInternetReachable !== false) {
        void syncOfflineEggQueue();
      }
    });
  }, [syncOfflineEggQueue, user]);

  if (!fontsLoaded || isCheckingSession) {
    return null;
  }

  function navigate(nextPage: MobilePage) {
    setPage(nextPage);
  }

  function renderPage() {
    return (
      <>
        {page === 'dashboard' && <DashboardView events={events} offlineSyncRevision={offlineSyncRevision} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />}
        {page === 'leaderboard' && <LeaderboardView offlineSyncRevision={offlineSyncRevision} selectedEventId={selectedEventId} />}
        {page === 'events' && <EventsView events={events} isLoading={isLoadingEvents} onEventsChanged={loadEvents} onSelectEvent={setSelectedEventId} />}
        {page === 'find' && <FindView onEventsChanged={loadEvents} />}
        {page === 'locator' && <LocatorView offlineSyncRevision={offlineSyncRevision} selectedEventId={selectedEventId} />}
        {page === 'panel' && user && <PanelView onNavigate={navigate} onSignedOut={() => setUser(null)} user={user} />}
        {page === 'codes' && <CodesView events={events} selectedEventId={selectedEventId} />}
        {page === 'create' && <CreateView events={events} selectedEventId={selectedEventId} />}
        {page === 'hide' && <HideView />}
        {page === 'score' && <ScoreView offlineSyncRevision={offlineSyncRevision} selectedEventId={selectedEventId} />}
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
        setUser(session.user);
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
              items={primaryPages}
              onBrandPress={() => navigate('dashboard')}
              onSelect={(key) => navigate(key as MobilePage)}
            />
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
                <FindView showTitle={false} onEventsChanged={loadEvents} />
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </EggeoUIProvider>
  );
}
