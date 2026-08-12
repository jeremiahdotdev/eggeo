import type { ApiLeaderboardEntry } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoPanel, EggeoText, eggeoColors } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { api } from '../../lib/api';
import { styles } from './LeaderboardView.styles';
import { ScreenMessage, ScreenTitle, viewStyles } from '../shared';

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
      {isLoading && (
        <EggeoPanel>
          <ActivityIndicator color={eggeoColors.ink} />
        </EggeoPanel>
      )}
      {entries.map((entry, index) => (
        <EggeoPanel key={`${entry.name}-${index}`} style={styles.rankCard}>
          <View style={viewStyles.row}>
            <EggeoText colorized style={styles.rankNumber}>
              {String(index + 1)}
            </EggeoText>
            <EggeoText style={viewStyles.rankName}>{entry.name}</EggeoText>
            <EggeoText>{appText.score.points(entry.points)}</EggeoText>
          </View>
        </EggeoPanel>
      ))}
      {!isLoading && entries.length === 0 && (
        <EggeoPanel>
          <EggeoText style={viewStyles.centerText}>{appText.score.messages.noScores}</EggeoText>
        </EggeoPanel>
      )}
      <ScreenMessage>{message}</ScreenMessage>
    </View>
  );
}
