'use client';

import { useEffect, useState } from 'react';
import type { ApiLeaderboardEntry } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoEventPicker, EggeoText } from '@eggeo/ui';
import { useEventSelection } from '@/components/EventSelection';
import { SkyPage } from '@/components/SkyScene';
import { apiRequest } from '@/lib/clientApi';

const placements = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

export function LeaderboardClient() {
  const { events, selectedEvent, selectedEventId, setSelectedEventId } = useEventSelection();
  const [users, setUsers] = useState<ApiLeaderboardEntry[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadLeaderboard() {
      if (!selectedEventId) {
        setUsers([]);
        return;
      }

      try {
        const params = new URLSearchParams({ eventId: selectedEventId });
        const nextUsers = await apiRequest<ApiLeaderboardEntry[]>(`/api/leaderboard?${params}`);

        if (!isCancelled) {
          setUsers(nextUsers);
        }
      } catch {
        if (!isCancelled) {
          setUsers([]);
        }
      }
    }

    void loadLeaderboard();

    return () => {
      isCancelled = true;
    };
  }, [selectedEventId]);

  return (
    <SkyPage>
      <EggeoText colorized variant="pageTitle">
        LEADERBOARD
      </EggeoText>
      <div className="row" style={{ margin: '0 auto 18px', maxWidth: 520 }}>
        <EggeoEventPicker
          allLabel={appText.events.labels.selectEvent}
          events={events}
          requireSelection
          selectedEventId={selectedEventId}
          webStyle={{ margin: 0, width: '100%' }}
          onSelect={setSelectedEventId}
        />
      </div>
      <section className="stack">
        {users.map((user, index) => (
          <article className="leader-card row" key={`${user.name}-${index}`}>
            <strong>{placements[index] || `${index + 1}th`}</strong>
            <strong>{user.name}</strong>
            <span>{Math.abs(user.points) === 1 ? `${user.points}pt.` : `${user.points}pts.`}</span>
          </article>
        ))}
        {users.length === 0 && (
          <article className="leader-card">
            <EggeoText>{selectedEvent ? appText.score.messages.noScores : appText.score.messages.selectEventForRanking}</EggeoText>
          </article>
        )}
      </section>
    </SkyPage>
  );
}
