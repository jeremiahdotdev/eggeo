import { appText } from '@eggeo/domain';
import * as Location from 'expo-location';
import { useState } from 'react';
import { View } from 'react-native';
import { HuntScore } from '../../components/HuntScore';
import { QrScanner } from '../../components/QrScanner';
import { api } from '../../lib/api';
import { enqueueOfflineEggAction, isOfflineError, notifyEggChanges } from '../../lib/offlineEggs';
import { getEggCode, isUuid } from '../../lib/egg';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

export function HideView({ selectedEventId, offlineSyncRevision = 0 }: { selectedEventId: string; offlineSyncRevision?: number }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function hideEgg(value: string) {
    const id = getEggCode(value);
    setMessage('');

    if (!isUuid(id)) {
      setMessage(appText.eggs.messages.invalidCode);
      return;
    }

    setIsSubmitting(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setMessage('Allow location access to hide eggs at your current spot.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      try {
        await api.hideEgg(id, coords);
        notifyEggChanges();
        setMessage(appText.eggs.messages.hidden);
      } catch (error) {
        if (!(await isOfflineError(error))) throw error;
        await enqueueOfflineEggAction('hideEgg', id, { coords });
        setMessage('Hidden offline. This location will sync when connected.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToHide);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.hide}</ScreenTitle>
      <HuntScore eventId={selectedEventId} revision={offlineSyncRevision} />
      <QrScanner disabled={isSubmitting} onDetect={hideEgg} />
      <ScreenMessage>{message}</ScreenMessage>
    </View>
  );
}
