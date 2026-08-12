import type { ApiEgg, ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoEventPicker, EggeoPanel, EggeoQrCard, EggeoText, eggeoColors } from '@eggeo/ui';
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

export function CodesView() {
  const [eggs, setEggs] = useState<ApiEgg[]>([]);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [eventId, setEventId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    if (!eventId) {
      setEggs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api
      .getUserEggs(eventId)
      .then(setEggs)
      .catch((error) => setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToLoadEggs))
      .finally(() => setIsLoading(false));
  }, [eventId]);

  useEffect(load, [load]);

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  async function deleteEgg(id: string) {
    await api.deleteEgg(id);
    load();
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.codes}</ScreenTitle>
      <PrintAction eggs={eggs} />
      <EggeoEventPicker allLabel={appText.events.labels.selectEvent} events={events} ownerOnly requireSelection selectedEventId={eventId} onSelect={setEventId} />
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
