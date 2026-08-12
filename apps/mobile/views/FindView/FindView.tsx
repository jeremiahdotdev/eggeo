import type { ApiEgg } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoText } from '@eggeo/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { api } from '../../lib/api';
import { getEggCode, isUuid, parseScanTarget } from '../../lib/egg';
import { QrScanner } from '../../components/QrScanner';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

export function FindView() {
  const [code, setCode] = useState('');
  const [foundEgg, setFoundEgg] = useState<ApiEgg | null>(null);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  async function findEgg(value = code) {
    const target = parseScanTarget(value);
    const id = target.id;
    setMessage('');

    if (!isUuid(id)) {
      setMessage(appText.events.messages.invalidCode);
      return;
    }

    setCode(id);
    setIsBusy(true);
    try {
      if (target.type === 'event') {
        const event = await api.joinEvent(id);
        setFoundEgg(null);
        setMessage(appText.events.messages.joined(event.title));
        return;
      }

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

  function leaveEggHidden() {
    setCode('');
    setFoundEgg(null);
    setMessage('');
  }

  const wasCollected = message === appText.eggs.messages.collected;

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.find}</ScreenTitle>
      <QrScanner disabled={isBusy} onDetect={findEgg} />
      <ScreenMessage>{message}</ScreenMessage>
      {foundEgg && (
        <View style={viewStyles.floatingBlock}>
          <EggeoText colorized style={viewStyles.cardTitle}>
            {foundEgg.title || appText.eggs.labels.eggFound}
          </EggeoText>
          {foundEgg.description && <EggeoText style={viewStyles.centerText}>{foundEgg.description}</EggeoText>}
          <EggeoText style={viewStyles.centerText}>{appText.eggs.points(foundEgg.points)}</EggeoText>
          <EggeoButton disabled={isBusy || wasCollected} onPress={collectEgg}>
            {appText.eggs.actions.collectNow}
          </EggeoButton>
          <EggeoButton disabled={isBusy || wasCollected} intent="ghost" onPress={leaveEggHidden}>
            {appText.eggs.actions.leaveHidden}
          </EggeoButton>
        </View>
      )}
    </View>
  );
}
