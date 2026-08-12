import type { ApiSessionUser } from '@eggeo/api-client';
import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoSkyScene, EggeoTitle, EggeoUIProvider, eggeoColors } from '@eggeo/ui';
import { ComicNeue_700Bold, useFonts } from '@expo-google-fonts/comic-neue';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { AuthForm } from './components/AuthForm';
import { api } from './lib/api';
import { CodesView } from './views/CodesView';
import { CreateView } from './views/CreateView';
import { DashboardView } from './views/DashboardView';
import { FindView } from './views/FindView';
import { HideView } from './views/HideView';
import { LeaderboardView } from './views/LeaderboardView';
import { LocatorView } from './views/LocatorView';
import { PanelView } from './views/PanelView';
import { ScoreView } from './views/ScoreView';
import { type MobilePage, primaryPages } from './views/routes';

export default function App() {
  const [fontsLoaded] = useFonts({ ComicNeue_700Bold });
  const [user, setUser] = useState<ApiSessionUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [page, setPage] = useState<MobilePage>('dashboard');

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

  return (
    <EggeoUIProvider>
      <View style={styles.safeArea}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
          <EggeoSkyScene>
            <View style={styles.authHeader}>
              <EggeoTitle>{appText.brand.title}</EggeoTitle>
            </View>
            {user ? (
              <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
                {page === 'dashboard' && <DashboardView user={user} />}
                {page === 'leaderboard' && <LeaderboardView />}
                {page === 'find' && <FindView />}
                {page === 'locator' && <LocatorView />}
                {page === 'panel' && <PanelView onNavigate={setPage} onSignedOut={() => setUser(null)} user={user} />}
                {page === 'codes' && <CodesView />}
                {page === 'create' && <CreateView />}
                {page === 'hide' && <HideView />}
                {page === 'score' && <ScoreView />}
              </ScrollView>
            ) : (
              <AuthForm onSignedIn={setUser} />
            )}
          </EggeoSkyScene>
          {user && (
            <View style={styles.tabBar}>
              {primaryPages.map((item) => (
                <EggeoButton intent={page === item.key ? 'secondary' : 'ghost'} key={item.key} onPress={() => setPage(item.key)} style={styles.tabButton}>
                  {item.label}
                </EggeoButton>
              ))}
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </EggeoUIProvider>
  );
}

const styles = StyleSheet.create({
  authHeader: {
    marginBottom: 22,
  },
  keyboard: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: eggeoColors.sky,
    flex: 1,
  },
  scroll: {
    alignSelf: 'stretch',
    flex: 1,
  },
  scrollContent: {
    gap: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  tabBar: {
    alignSelf: 'stretch',
    backgroundColor: eggeoColors.paper,
    borderColor: eggeoColors.border,
    borderTopWidth: 2,
    flexDirection: 'row',
    gap: 6,
    padding: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 42,
  },
});
