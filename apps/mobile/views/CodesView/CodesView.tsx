import type { ApiEgg, ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoPanel, EggeoQrCard, EggeoText, eggeoColors } from '@eggeo/ui';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PrintAction } from '../../components/PrintAction';
import { api } from '../../lib/api';
import { parseLinkFromEgg } from '../../lib/egg';
import { ScreenMessage, ScreenQrCode, ScreenTitle, viewStyles } from '../shared';

const qrStyles = {
  deleteButton: {
    width: '100%',
  },
} as const;

export function CodesView({
  events,
  selectedEventId,
}: {
  events: ApiEvent[];
  selectedEventId: string;
}) {
  const [eggs, setEggs] = useState<ApiEgg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const ownerEventId = events.some((event) => event.id === selectedEventId && event.isOwner) ? selectedEventId : '';

  const load = useCallback(() => {
    if (!ownerEventId) {
      setEggs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api
      .getUserEggs(ownerEventId)
      .then(setEggs)
      .catch((error) => setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToLoadEggs))
      .finally(() => setIsLoading(false));
  }, [ownerEventId]);

  useEffect(load, [load]);

  async function deleteEgg(id: string) {
    try {
      await api.deleteEgg(id);
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete egg.');
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.codes}</ScreenTitle>
      <PrintAction eggs={eggs} />
      {isLoading && <ActivityIndicator color={eggeoColors.ink} />}
      {eggs.map((egg) => (
        <EggeoQrCard
          action={
            <EggeoButton intent="danger" onPress={() => void deleteEgg(egg.id)} style={qrStyles.deleteButton}>
              {appText.common.actions.delete}
            </EggeoButton>
          }
          color={egg.color}
          key={egg.id}
          qr={<ScreenQrCode value={parseLinkFromEgg(egg.id)} />}
          title={egg.title || appText.eggs.labels.untitled}
        />
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
