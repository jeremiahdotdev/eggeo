import type { ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoEventPicker, EggeoPanel, EggeoText } from '@eggeo/ui';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { api } from '../../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

export function ScoreView() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [eventId, setEventId] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const loadScore = useCallback(() => {
    if (!eventId) {
      setPoints(0);
      return;
    }

    setPoints(null);
    api
      .getScore(eventId)
      .then((score) => setPoints(score.points))
      .catch(() => setPoints(0));
  }, [eventId]);

  useEffect(loadScore, [loadScore]);

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  async function reset() {
    if (!eventId) {
      setMessage(appText.score.messages.selectEventForScore);
      return;
    }

    const score = await api.resetScore(eventId);
    setPoints(score.points);
    setMessage(appText.score.messages.reset);
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.score}</ScreenTitle>
      <EggeoEventPicker
        allLabel={appText.events.labels.selectEvent}
        events={events}
        requireSelection
        selectedEventId={eventId}
        onSelect={(nextEventId) => {
          setEventId(nextEventId);
          setMessage('');
        }}
      />
      <EggeoPanel>
        <EggeoText colorized style={viewStyles.panelTitle}>
          {points === null ? appText.common.status.loading : String(points)}
        </EggeoText>
        <ScreenMessage>{message || (!eventId ? appText.score.messages.selectEventForScore : '')}</ScreenMessage>
        <EggeoButton disabled={!eventId || points === null} intent="danger" onPress={reset}>
          {appText.eggs.actions.resetScore}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
