import { requirePageSession } from '@/components/RequireAuth';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  await requirePageSession();

  return <DashboardClient />;
}
