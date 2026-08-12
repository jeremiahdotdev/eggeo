import type { ApiSessionUser } from '@eggeo/api-client';
import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoPanel, EggeoText } from '@eggeo/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../lib/api';
import { type MobilePage, setupPages } from './routes';
import { ScreenTitle, viewStyles } from './shared';

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

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.panel}</ScreenTitle>
      <EggeoPanel>
        <EggeoText style={viewStyles.centerText}>{user.name || user.email || user.username}</EggeoText>
        {setupPages.map((item) => (
          <EggeoButton intent="secondary" key={item.key} onPress={() => onNavigate(item.key)}>
            {item.label}
          </EggeoButton>
        ))}
        <EggeoButton isLoading={isSigningOut} intent="ghost" onPress={signOut}>
          {appText.common.actions.signOut}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
