import type { ApiSessionUser } from '@eggeo/api-client';
import { appText } from '@eggeo/static-text';
import { EggeoPanel, EggeoText } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { api } from '../lib/api';
import { ScreenTitle, viewStyles } from './shared';

export function DashboardView({ user }: { user: ApiSessionUser }) {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    api
      .getScore()
      .then((score) => setPoints(score.points))
      .catch(() => setPoints(0));
  }, []);

  return (
    <View style={viewStyles.stack}>
      <ScreenTitle>{appText.brand.title}</ScreenTitle>
      <EggeoPanel>
        <EggeoText colorized style={viewStyles.panelTitle}>
          {points === null ? appText.common.status.loading : String(points)}
        </EggeoText>
        <EggeoText style={viewStyles.centerText}>{appText.score.messages.signedInAs(user.name || user.email || user.username)}</EggeoText>
      </EggeoPanel>
    </View>
  );
}
