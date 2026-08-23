import { requirePageSession } from '@/components/RequireAuth';
import { ScoreClient } from './ScoreClient';

export default async function ScorePage() {
  await requirePageSession();

  return <ScoreClient />;
}
