import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoField, EggeoPanel } from '@eggeo/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../lib/api';
import { getEggCode, isUuid } from '../lib/egg';
import { ScreenMessage, ScreenTitle, viewStyles } from './shared';

export function HideView() {
  const [code, setCode] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function hideEgg() {
    const id = getEggCode(code);
    setMessage('');

    if (!isUuid(id)) {
      setMessage(appText.eggs.messages.invalidCode);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.hideEgg(id, { lat: Number(lat), lng: Number(lng) });
      setMessage(appText.eggs.messages.hidden);
      setCode('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToHide);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.hide}</ScreenTitle>
      <EggeoPanel>
        <EggeoField label={appText.eggs.fields.eggCodeOrLink} onChangeText={setCode} value={code} />
        <EggeoField label={appText.eggs.fields.latitude} onChangeText={setLat} type="number" value={lat} />
        <EggeoField label={appText.eggs.fields.longitude} onChangeText={setLng} type="number" value={lng} />
        <ScreenMessage>{message}</ScreenMessage>
        <EggeoButton isLoading={isSubmitting} onPress={hideEgg}>
          {appText.eggs.actions.hideHere}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
