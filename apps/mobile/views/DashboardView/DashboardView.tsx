import type { ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoEventPicker, ScoreBubble } from '@eggeo/ui';
import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { api } from '../../lib/api';
import { styles } from './DashboardView.styles';
import { ScreenTitle, viewStyles } from '../shared';

export function DashboardView({
  events,
  selectedEventId,
  onSelectEvent,
}: {
  events: ApiEvent[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
}) {
  const [points, setPoints] = useState<number | null>(null);
  const { height, width } = useWindowDimensions();
  const eggSize = Math.min(Math.max(width * 1.26, 450), 560);
  const eggLift = -height * 0.2;
  const scoreSize = Math.max(84, eggSize * 0.24);
  const scoreTop = eggSize * 0.64 - scoreSize / 2;

  useEffect(() => {
    setPoints(null);
    api
      .getScore(selectedEventId || undefined)
      .then((score) => setPoints(score.points))
      .catch(() => setPoints(0));
  }, [selectedEventId]);

  return (
    <View style={[viewStyles.stack, styles.dashboard]}>
      <ScreenTitle>{appText.brand.title}</ScreenTitle>
      <EggeoEventPicker allLabel={appText.events.labels.selectEvent} events={events} requireSelection selectedEventId={selectedEventId} style={styles.eventPicker} onSelect={onSelectEvent} />
      <View style={[styles.eggStage, { transform: [{ translateY: eggLift }] }]}>
        <View style={styles.eggWrap}>
          <EggIcon seed="dashboard-eggeo" showGrass size={eggSize} strokeWidth={4} />
        </View>
        <ScoreBubble
          size={scoreSize}
          style={[styles.scoreBubble, { top: scoreTop }]}
          textStyle={{ fontSize: scoreSize * 0.58, lineHeight: scoreSize * 0.64 }}
        >
          {points === null ? appText.common.status.loading : String(points)}
        </ScoreBubble>
      </View>
    </View>
  );
}
