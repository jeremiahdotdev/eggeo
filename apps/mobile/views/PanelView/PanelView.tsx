import type { ApiSessionUser } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoActionPanel, type EggeoActionPanelItem } from '@eggeo/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../../lib/api';
import { type MobilePage, setupPages } from '../routes';
import { ScreenTitle, viewStyles } from '../shared';

export function PanelView({
  onNavigate,
  onSignedOut,
  user,
}: {
  onNavigate: (page: MobilePage) => void;
  onSignedOut: () => void;
  user: ApiSessionUser;
}) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);

    try {
      await api.logout();
    } finally {
      setIsSigningOut(false);
      onSignedOut();
    }
  }

  const actions: EggeoActionPanelItem[] = [
    ...setupPages.map((item) => ({ intent: 'secondary' as const, key: item.key, label: item.label })),
    { intent: 'ghost', isLoading: isSigningOut, key: 'sign-out', label: appText.common.actions.signOut },
  ];

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{user.name || user.email || user.username}</ScreenTitle>
      <EggeoActionPanel
        items={actions}
        onSelect={(key) => {
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
