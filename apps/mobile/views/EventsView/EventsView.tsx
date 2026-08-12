import type { ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoEventQrCard, EggeoField, EggeoPanel, EggeoText, eggeoColors } from '@eggeo/ui';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { api } from '../../lib/api';
import { parseLinkFromEvent } from '../../lib/egg';
import { ScreenMessage, ScreenQrCode, ScreenTitle, viewStyles } from '../shared';

export function EventsView() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    setIsLoading(true);
    api
      .getEvents()
      .then(setEvents)
      .catch((error) => setMessage(error instanceof Error ? error.message : appText.events.messages.unableToLoad))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(load, [load]);

  async function createEvent() {
    setIsSubmitting(true);
    setMessage('');

    try {
      await api.createEvent({ description, title });
      setTitle('');
      setDescription('');
      setMessage(appText.events.messages.created);
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.events.messages.unableToCreate);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteEvent(id: string) {
    setMessage('');
    try {
      await api.deleteEvent(id);
      setMessage(appText.events.messages.deleted);
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.events.messages.unableToDelete);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.events}</ScreenTitle>
      <EggeoPanel>
        <EggeoField label={appText.events.fields.title} onChangeText={setTitle} required value={title} />
        <EggeoField label={appText.events.fields.description} multiline onChangeText={setDescription} value={description} />
        <EggeoButton isLoading={isSubmitting} onPress={createEvent}>
          {appText.events.actions.create}
        </EggeoButton>
      </EggeoPanel>
      {isLoading && <ActivityIndicator color={eggeoColors.ink} />}
      {events.map((event) => (
        <EggeoEventQrCard isOwner={event.isOwner} key={event.id} qr={<ScreenQrCode value={parseLinkFromEvent(event.id)} />} title={event.title} onDelete={() => void deleteEvent(event.id)} />
      ))}
      {!isLoading && events.length === 0 && (
        <EggeoPanel>
          <EggeoText style={viewStyles.centerText}>{appText.events.messages.noEvents}</EggeoText>
        </EggeoPanel>
      )}
      <ScreenMessage>{message}</ScreenMessage>
    </View>
  );
}
