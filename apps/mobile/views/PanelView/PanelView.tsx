import type { ApiSessionUser } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoActionPanel, type EggeoActionPanelItem } from '@eggeo/ui';
import { useState } from 'react';
import { Alert, Linking, View } from 'react-native';
import { API_BASE_URL, api } from '../../lib/api';
import { clearOfflineEggStorage } from '../../lib/offlineEggs';
import { type MobilePage, setupPages } from '../routes';
import { ScreenTitle, viewStyles } from '../shared';

export function PanelView({
  onNavigate,
  onSignedOut,
  user,
}: {
  onNavigate: (page: MobilePage) => void;
  onSignedOut: () => Promise<void>;
  user: ApiSessionUser;
}) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  async function signOut() {
    setIsSigningOut(true);

    try {
      await onSignedOut();
      await api.logout().catch(() => undefined);
    } catch {
      Alert.alert('Unable to sign out', 'Your device could not save the sign-out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }

  async function performDeleteAccount() {
    setIsDeletingAccount(true);

    try {
      await api.deleteAccount();
      await clearOfflineEggStorage();
      await onSignedOut();
    } catch (error) {
      Alert.alert(appText.auth.messages.unableToDeleteAccount, error instanceof Error ? error.message : undefined);
    } finally {
      setIsDeletingAccount(false);
    }
  }

  function confirmDeleteAccount() {
    Alert.alert(appText.auth.messages.deleteAccountTitle, appText.auth.messages.deleteAccountBody, [
      {
        style: 'cancel',
        text: appText.common.actions.cancel,
      },
      {
        onPress: () => void performDeleteAccount(),
        style: 'destructive',
        text: appText.common.actions.deleteAccount,
      },
    ]);
  }

  const actions: EggeoActionPanelItem[] = [
    ...setupPages.map((item) => ({ intent: 'secondary' as const, key: item.key, label: item.label })),
    { intent: 'secondary', key: 'privacy', label: 'Privacy Policy' },
    { intent: 'danger', isLoading: isDeletingAccount, key: 'delete-account', label: appText.common.actions.deleteAccount },
    { intent: 'ghost', isLoading: isSigningOut, key: 'sign-out', label: appText.common.actions.signOut },
  ];

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{user.name || user.email || user.username}</ScreenTitle>
      <EggeoActionPanel
        items={actions}
        onSelect={(key) => {
          if (key === 'privacy') {
            void Linking.openURL(`${API_BASE_URL.replace(/\/$/, '')}/privacy`).catch(() => {
              Alert.alert('Privacy Policy', 'Connect to the internet to open the privacy policy.');
            });
            return;
          }

          if (key === 'delete-account') {
            confirmDeleteAccount();
            return;
          }

          if (key === 'sign-out') {
            void signOut();
            return;
          }

          onNavigate(key as MobilePage);
        }}
      />
    </View>
  );
}
