'use client';

import { appText } from '@eggeo/domain';
import { EggeoEventPicker, EggeoText } from '@eggeo/ui';
import { useEventSelection } from '@/components/EventSelection';
import { ScoreReset } from '@/components/ScoreReset';
import { SkyScene } from '@/components/SkyScene';

export function ScoreClient() {
  const { events, selectedEventId, setSelectedEventId } = useEventSelection();

  return (
    <SkyScene className="hero">
      <section className="stack" style={{ width: 'min(720px, 100%)' }}>
        <EggeoText colorized variant="pageTitle">
          {appText.nav.score}
        </EggeoText>
        <EggeoEventPicker
          allLabel={appText.events.labels.selectEvent}
          events={events}
          requireSelection
          selectedEventId={selectedEventId}
          webStyle={{ margin: 0, width: '100%' }}
          onSelect={setSelectedEventId}
        />
        <ScoreReset eventId={selectedEventId} />
      </section>
    </SkyScene>
  );
}
