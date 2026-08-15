import type { ApiSessionUser } from '@eggeo/api-client';
import { EGG_DEFAULT_POINTS, appText } from '@eggeo/domain';
import { EggeoAuthPanel, EggeoNavBar, EggeoSkyScene, EggeoTitle, EggeoUIProvider, type AuthPanelMode } from '@eggeo/ui';
import { ComicNeue_700Bold, useFonts } from '@expo-google-fonts/comic-neue';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { api } from '../lib/api';
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

  if (!fontsLoaded || isCheckingSession) {
    return null;
  }

  function navigate(nextPage: MobilePage) {
    setPage(nextPage);
  }

  function renderPage() {
    return (
      <>
        {page === 'dashboard' && <DashboardView />}
        {page === 'leaderboard' && <LeaderboardView />}
        {page === 'events' && <EventsView />}
        {page === 'find' && <FindView />}
        {page === 'locator' && <LocatorView />}
        {page === 'panel' && user && <PanelView onNavigate={navigate} onSignedOut={() => setUser(null)} user={user} />}
        {page === 'codes' && <CodesView />}
        {page === 'create' && <CreateView />}
        {page === 'hide' && <HideView />}
        {page === 'score' && <ScoreView />}
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
        setUser(session.user);
        return;
      }

      setAuthMessage(appText.auth.messages.signedIn);
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
      </View>
    </EggeoUIProvider>
  );
}
