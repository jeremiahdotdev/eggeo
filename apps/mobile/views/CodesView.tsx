import type { ApiEgg } from '@eggeo/api-client';
import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoPanel, EggeoText, eggeoColors } from '@eggeo/ui';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { api } from '../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from './shared';

export function CodesView() {
  const [eggs, setEggs] = useState<ApiEgg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    setIsLoading(true);
    api
      .getUserEggs()
      .then(setEggs)
      .catch((error) => setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToLoadEggs))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(load, [load]);

  async function deleteEgg(id: string) {
    await api.deleteEgg(id);
    load();
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.codes}</ScreenTitle>
      {isLoading && <ActivityIndicator color={eggeoColors.ink} />}
      {eggs.map((egg) => (
        <EggeoPanel key={egg.id}>
          <EggeoText colorized style={viewStyles.cardTitle}>
            {egg.title || appText.eggs.labels.untitled}
          </EggeoText>
          <EggeoText style={viewStyles.centerText}>{egg.id}</EggeoText>
          <EggeoButton intent="danger" onPress={() => void deleteEgg(egg.id)}>
            {appText.common.actions.delete}
          </EggeoButton>
        </EggeoPanel>
      ))}
      {!isLoading && eggs.length === 0 && (
        <EggeoPanel>
          <EggeoText style={viewStyles.centerText}>{appText.eggs.messages.noPrintableEggs}</EggeoText>
        </EggeoPanel>
      )}
      <ScreenMessage>{message}</ScreenMessage>
    </View>
  );
}
