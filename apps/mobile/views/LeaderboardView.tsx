import type { ApiLeaderboardEntry } from '@eggeo/api-client';
import { appText } from '@eggeo/static-text';
import { EggeoPanel, EggeoText, eggeoColors } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { api } from '../lib/api';
import { ScreenMessage, ScreenTitle, viewStyles } from './shared';

export function LeaderboardView() {
  const [entries, setEntries] = useState<ApiLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .getLeaderboard()
      .then(setEntries)
      .catch((error) => setMessage(error instanceof Error ? error.message : appText.score.messages.unableToLoadRanking))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.nav.leaderboard}</ScreenTitle>
      <EggeoPanel>
        {isLoading && <ActivityIndicator color={eggeoColors.ink} />}
        {entries.map((entry, index) => (
          <View key={`${entry.name}-${index}`} style={viewStyles.row}>
            <EggeoText style={viewStyles.rankName}>
              {index + 1}. {entry.name}
            </EggeoText>
            <EggeoText>{appText.score.points(entry.points)}</EggeoText>
          </View>
        ))}
        {!isLoading && entries.length === 0 && <EggeoText style={viewStyles.centerText}>{appText.score.messages.noScores}</EggeoText>}
        <ScreenMessage>{message}</ScreenMessage>
      </EggeoPanel>
    </View>
  );
}
