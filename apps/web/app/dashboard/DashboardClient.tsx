'use client';

import { useEffect, useState } from 'react';
import type { ApiScore } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggIcon, EggeoEventPicker, EggeoText, ScoreBubble } from '@eggeo/ui';
import { SkyScene } from '@/components/SkyScene';
import { useEventSelection } from '@/components/EventSelection';
import { apiRequest } from '@/lib/clientApi';
import styles from './page.module.css';

export function DashboardClient() {
  const { events, selectedEventId, setSelectedEventId } = useEventSelection();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadScore() {
      try {
        const params = new URLSearchParams();

        if (selectedEventId) {
          params.set('eventId', selectedEventId);
        }

        const response = await apiRequest<ApiScore>(`/api/score${params.size ? `?${params}` : ''}`);

        if (!isCancelled) {
          setPoints(response.points);
        }
      } catch {
        if (!isCancelled) {
          setPoints(0);
        }
      }
    }

    void loadScore();

    return () => {
      isCancelled = true;
    };
  }, [selectedEventId]);

  return (
    <SkyScene className="home-hero" variant="home">
      <section className="home-inner">
        <div className="home-title-lock">
          <EggeoText className={styles.title} colorized variant="title">
            {appText.brand.title}
          </EggeoText>
          <div className="home-event-picker">
            <EggeoEventPicker
              allLabel={appText.events.labels.selectEvent}
              events={events}
              requireSelection
              selectedEventId={selectedEventId}
              webStyle={{ margin: 0, width: '100%' }}
              onSelect={setSelectedEventId}
            />
          </div>
        </div>
        <div className="home-egg">
          <div className="home-hill" aria-hidden="true" />
          <EggIcon seed="dashboard-eggeo" size={360} showGrass />
          <ScoreBubble className="score-bubble" size="var(--score-bubble-size)">
            {String(points)}
          </ScoreBubble>
        </div>
      </section>
    </SkyScene>
  );
}
