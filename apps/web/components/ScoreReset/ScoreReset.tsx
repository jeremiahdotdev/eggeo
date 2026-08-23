'use client';

import { useEffect, useState } from 'react';
import type { ApiScore } from '@eggeo/api-client';
import { appText } from '@eggeo/domain';
import { EggeoButton, EggeoText } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';
import styles from './ScoreReset.module.css';

export function ScoreReset({ eventId }: { eventId: string }) {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSelectedEvent = Boolean(eventId);

  useEffect(() => {
    let isCancelled = false;

    async function loadScore() {
      if (!hasSelectedEvent) {
        setPoints(0);
        setIsSubmitting(false);
        return;
      }

      setIsLoading(true);
      setIsSubmitting(false);

      try {
        const params = new URLSearchParams({ eventId });
        const response = await apiRequest<ApiScore>(`/api/score?${params}`);

        if (!isCancelled) {
          setPoints(response.points);
        }
      } catch {
        if (!isCancelled) {
          setPoints(0);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadScore();

    return () => {
      isCancelled = true;
    };
  }, [eventId, hasSelectedEvent]);

  async function resetScore() {
    if (!hasSelectedEvent) {
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({ eventId });
      const response = await apiRequest<ApiScore>(`/api/score?${params}`, undefined, { method: 'DELETE' });
      setPoints(response.points);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.shell}>
      <h1>{points}</h1>
      {!hasSelectedEvent && <EggeoText>{appText.score.messages.selectEventForScore}</EggeoText>}
      <EggeoButton disabled={!hasSelectedEvent || isLoading || isSubmitting} intent="danger" onPress={resetScore}>
        RESET SCORE
      </EggeoButton>
    </section>
  );
}
