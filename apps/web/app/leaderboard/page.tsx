import { requirePageSession } from '@/components/RequireAuth';
import { LeaderboardClient } from './LeaderboardClient';

export default async function LeaderboardPage() {
  await requirePageSession();

  return <LeaderboardClient />;
}
