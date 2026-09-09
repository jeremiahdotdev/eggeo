import { EggeoText } from '@eggeo/ui';
import { useHuntScore } from '../lib/useHuntScore';

export function HuntScore({ eventId, revision = 0 }: { eventId: string; revision?: number }) {
  const { points, pending, unavailable } = useHuntScore(eventId, revision);
  return <EggeoText>
    Score: {points ?? (unavailable ? '—' : '…')}{pending > 0 ? ` · ${pending} find(s) awaiting sync` : ''}
  </EggeoText>;
}
