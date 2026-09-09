'use client';

import { Platform, View } from 'react-native';
import { EggeoText } from '../primitives';
import { styles, webStyles } from './OfflineBanner.styles';

export function EggeoOfflineBanner({ isSignedIn = true }: { isSignedIn?: boolean }) {
  const message = isSignedIn
    ? 'Offline — Find, Hide, and Map use saved data. Changes sync when connected.'
    : 'Offline — connect to sign in.';

  if (Platform.OS === 'web') {
    return <div role="status" style={webStyles.banner}>{message}</div>;
  }

  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <EggeoText style={styles.text}>{message}</EggeoText>
    </View>
  );
}
