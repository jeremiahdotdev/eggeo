import { appText } from '@eggeo/domain';
import { EggIcon, ScoreBubble } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { api } from '../../lib/api';
import { styles } from './DashboardView.styles';
import { ScreenTitle, viewStyles } from '../shared';

export function DashboardView() {
  const [points, setPoints] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const eggSize = Math.min(Math.max(width * 1.26, 450), 560);
  const scoreSize = Math.max(84, eggSize * 0.24);

  useEffect(() => {
    api
      .getScore()
      .then((score) => setPoints(score.points))
      .catch(() => setPoints(0));
  }, []);

  return (
    <View style={[viewStyles.stack, styles.dashboard]}>
      <ScreenTitle>{appText.brand.title}</ScreenTitle>
      <View style={styles.eggStage}>
        <View style={styles.eggWrap}>
          <EggIcon seed="dashboard-eggeo" showGrass size={eggSize} strokeWidth={4} />
        </View>
        <ScoreBubble
          size={scoreSize}
          style={[styles.scoreBubble, { top: eggSize * 0.52 - 44 }]}
          textStyle={{ fontSize: scoreSize * 0.58, lineHeight: scoreSize * 0.64 }}
        >
          {points === null ? appText.common.status.loading : String(points)}
        </ScoreBubble>
      </View>
    </View>
  );
}
