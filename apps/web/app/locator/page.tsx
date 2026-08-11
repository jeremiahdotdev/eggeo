import { NearbyEggs } from '@/components/NearbyEggs';
import { requirePageSession } from '@/components/RequireAuth';

export default async function LocatorPage() {
  await requirePageSession();
  return <NearbyEggs />;
}
