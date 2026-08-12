import { appText } from '@eggeo/static-text';
import { EggeoButton, EggeoPanel, EggeoText } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { api } from '../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from './shared';

export function ScoreView() {
  const [points, setPoints] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .getScore()
      .then((score) => setPoints(score.points))
      .catch(() => setPoints(0));
  }, []);

  async function reset() {
    const score = await api.resetScore();
    setPoints(score.points);
    setMessage(appText.score.messages.reset);
  }

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.score}</ScreenTitle>
      <EggeoPanel>
        <EggeoText colorized style={viewStyles.panelTitle}>
          {points === null ? appText.common.status.loading : String(points)}
        </EggeoText>
        <ScreenMessage>{message}</ScreenMessage>
        <EggeoButton intent="danger" onPress={reset}>
          {appText.eggs.actions.resetScore}
        </EggeoButton>
      </EggeoPanel>
    </View>
  );
}
