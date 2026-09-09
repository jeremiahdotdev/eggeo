import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoPanel, EggeoText } from '@eggeo/ui';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { api } from '../../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

export function ScoreView({
  offlineSyncRevision = 0,
  selectedEventId,
}: {
  offlineSyncRevision?: number;
  selectedEventId: string;
}) {
  const [points, setPoints] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const eventId = selectedEventId;

  const loadScore = useCallback(() => {
    if (!eventId) {
      setPoints(0);
      return;
    }

    setPoints(null);
    setMessage('');
    api
      .getScore(eventId)
      .then((score) => setPoints(score.points))
      .catch(error => setMessage(error instanceof Error ? error.message : 'Score unavailable.'));
  }, [eventId, offlineSyncRevision]);

  useEffect(loadScore, [loadScore]);

  async function reset() {
    if (!eventId) {
      setMessage(appText.score.messages.selectEventForScore);
      return;
    }

    try {
      const score = await api.resetScore(eventId);
      setPoints(score.points);
      setMessage(appText.score.messages.reset);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to reset score.');
    }
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.score}</ScreenTitle>
      <EggeoPanel>
        <EggeoText colorized style={viewStyles.panelTitle}>
          {points === null ? (message ? '—' : appText.common.status.loading) : String(points)}
        </EggeoText>
        <ScreenMessage>{message || (!eventId ? appText.score.messages.selectEventForScore : '')}</ScreenMessage>
        <EggeoButton disabled={!eventId || points === null} intent="danger" onPress={reset}>
          {appText.eggs.actions.resetScore}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
