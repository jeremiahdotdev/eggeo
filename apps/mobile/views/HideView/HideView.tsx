import { appText } from '@eggeo/domain';
import * as Location from 'expo-location';
import { useState } from 'react';
import { View } from 'react-native';
import { QrScanner } from '../../components/QrScanner';
import { api } from '../../lib/api';
import { getEggCode, isUuid } from '../../lib/egg';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

export function HideView() {
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

      await api.hideEgg(id, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMessage(appText.eggs.messages.hidden);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToHide);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.hide}</ScreenTitle>
      <QrScanner disabled={isSubmitting} onDetect={hideEgg} />
      <ScreenMessage>{message}</ScreenMessage>
    </View>
  );
}
