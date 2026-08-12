import type { ApiEgg } from '@eggeo/api-client';
import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoField, EggeoPanel, EggeoText } from '@eggeo/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../lib/api';
import { getEggCode, isUuid } from '../lib/egg';
import { ScreenMessage, ScreenTitle, viewStyles } from './shared';

export function FindView() {
  const [code, setCode] = useState('');
  const [foundEgg, setFoundEgg] = useState<ApiEgg | null>(null);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  async function findEgg() {
    const id = getEggCode(code);
    setMessage('');

    if (!isUuid(id)) {
      setMessage(appText.eggs.messages.invalidCode);
      return;
    }

    setIsBusy(true);
    try {
      const response = await api.findEgg(id);
      setFoundEgg(response.Egg);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToFind);
    } finally {
      setIsBusy(false);
    }
  }

  async function collectEgg() {
    const id = getEggCode(code);
    setIsBusy(true);
    setMessage('');

    try {
      await api.collectEgg(id);
      setMessage(appText.eggs.messages.collected);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToCollect);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.find}</ScreenTitle>
      <EggeoPanel>
        <EggeoField label={appText.eggs.fields.eggCodeOrLink} onChangeText={setCode} value={code} />
        <EggeoButton isLoading={isBusy} onPress={findEgg}>
          {appText.eggs.actions.find}
        </EggeoButton>
        {foundEgg && (
          <View style={viewStyles.stack}>
            <EggeoText colorized style={viewStyles.cardTitle}>
              {foundEgg.title || appText.eggs.labels.eggFound}
            </EggeoText>
            {foundEgg.description && <EggeoText style={viewStyles.centerText}>{foundEgg.description}</EggeoText>}
            <EggeoText style={viewStyles.centerText}>{appText.eggs.points(foundEgg.points)}</EggeoText>
            <EggeoButton disabled={message === appText.eggs.messages.collected} onPress={collectEgg}>
              {appText.eggs.actions.collectNow}
            </EggeoButton>
          </View>
        )}
        <ScreenMessage>{message}</ScreenMessage>
      </EggeoPanel>
    </View>
  );
}
