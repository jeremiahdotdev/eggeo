'use client';

import { useEffect, useState } from 'react';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoText } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';
import styles from './ScoreReset.module.css';

export function ScoreReset({ eventId, initialPoints }: { eventId: string; initialPoints: number }) {
  const [points, setPoints] = useState(initialPoints);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSelectedEvent = Boolean(eventId);

  useEffect(() => {
    setPoints(initialPoints);
    setIsSubmitting(false);
  }, [eventId, initialPoints]);

  async function resetScore() {
    if (!hasSelectedEvent) {
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({ eventId });
      const response = await apiRequest<{ points: number }>(`/api/score?${params}`, undefined, { method: 'DELETE' });
      setPoints(response.points);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.shell}>
      <h1>{points}</h1>
      {!hasSelectedEvent && <EggeoText>{appText.score.messages.selectEventForScore}</EggeoText>}
      <EggeoButton disabled={!hasSelectedEvent || isSubmitting} intent="danger" onPress={resetScore}>
        RESET SCORE
      </EggeoButton>
    </section>
  );
}
