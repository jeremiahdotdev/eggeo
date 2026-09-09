import type { ApiEvent } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoEventPicker, EggeoText, ScoreBubble } from '@eggeo/ui';
import { useWindowDimensions, View } from 'react-native';
import { useHuntScore } from '../../lib/useHuntScore';
import { styles } from './DashboardView.styles';
import { ScreenTitle, viewStyles } from '../shared';

export function DashboardView({
  events,
  offlineSyncRevision = 0,
  selectedEventId,
  onSelectEvent,
}: {
  events: ApiEvent[];
  offlineSyncRevision?: number;
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
}) {
  const { points, pending, unavailable } = useHuntScore(selectedEventId, offlineSyncRevision);
  const { height, width } = useWindowDimensions();
  const eggSize = Math.min(Math.max(width * 1.26, 450), 560);
  const eggLift = -height * 0.2;
  const scoreSize = Math.max(84, eggSize * 0.24);
  const scoreTop = eggSize * 0.64 - scoreSize / 2;

  return (
    <View style={[viewStyles.stack, styles.dashboard]}>
      <ScreenTitle>{appText.brand.title}</ScreenTitle>
      <EggeoEventPicker allLabel={appText.events.labels.selectEvent} events={events} requireSelection selectedEventId={selectedEventId} style={styles.eventPicker} onSelect={onSelectEvent} />
      {pending > 0 && <EggeoText>{pending} find(s) awaiting sync.</EggeoText>}
      <View style={[styles.eggStage, { transform: [{ translateY: eggLift }] }]}>
        <View style={styles.eggWrap}>
          <EggIcon seed="dashboard-eggeo" showGrass size={eggSize} strokeWidth={4} />
        </View>
        <ScoreBubble
          size={scoreSize}
          style={[styles.scoreBubble, { top: scoreTop }]}
          textStyle={{ fontSize: scoreSize * 0.58, lineHeight: scoreSize * 0.64 }}
        >
          {points === null ? (unavailable ? '—' : appText.common.status.loading) : String(points)}
        </ScoreBubble>
      </View>
    </View>
  );
}
