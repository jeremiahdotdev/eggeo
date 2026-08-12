import type { ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoEventPicker, EggeoField, EggeoPanel } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { api } from '../../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

export function CreateView() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('1');
  const [color, setColor] = useState('#ffffff');
  const [count, setCount] = useState('1');
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [eventId, setEventId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = Boolean(eventId) && !isSubmitting;

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  async function submit() {
    if (!eventId) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await api.createEggs({
        color,
        count: Number(count),
        description,
        eventId,
        points: Number(points),
        title,
      });
      setMessage(appText.eggs.messages.created(response.created));
      setTitle('');
      setDescription('');
      setPoints('1');
      setCount('1');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : appText.eggs.messages.unableToCreate);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.create}</ScreenTitle>
      <EggeoPanel>
        <EggeoField label={appText.eggs.fields.title} onChangeText={setTitle} required value={title} />
        <EggeoField label={appText.eggs.fields.description} multiline onChangeText={setDescription} required value={description} />
        <EggeoField keyboardType="default" label={appText.eggs.fields.points} onChangeText={setPoints} required type="number" value={points} />
        <EggeoField label={appText.eggs.fields.color} onChangeText={setColor} type="color" value={color} />
        <EggeoField keyboardType="default" label={appText.eggs.fields.count} onChangeText={setCount} required type="number" value={count} />
        <EggeoEventPicker allLabel={appText.events.labels.selectEvent} events={events} ownerOnly requireSelection selectedEventId={eventId} onSelect={setEventId} />
        <ScreenMessage>{message}</ScreenMessage>
        <EggeoButton disabled={!canSubmit} isLoading={isSubmitting} onPress={submit}>
          {appText.common.actions.submit}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
