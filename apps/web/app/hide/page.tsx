import { HideEggFlow } from '@/components/EggCodeFlow';
import { requirePageSession } from '@/components/RequireAuth';

export default async function HidePage() {
  await requirePageSession();
  return <HideEggFlow />;
}
