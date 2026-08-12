'use client';

import { useState } from 'react';
import { EggeoButton } from '@eggeo/ui';
import { apiRequest } from '@/lib/clientApi';

export function ScoreReset({ initialPoints }: { initialPoints: number }) {
  const [points, setPoints] = useState(initialPoints);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function resetScore() {
    setIsSubmitting(true);
    try {
      const response = await apiRequest<{ points: number }>('/api/score', undefined, { method: 'DELETE' });
      setPoints(response.points);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="hero-inner stack">
      <h1>{points}</h1>
      <EggeoButton disabled={isSubmitting} intent="danger" onPress={resetScore}>
        RESET SCORE
      </EggeoButton>
    </section>
  );
}
