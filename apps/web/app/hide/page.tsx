import { HideEggFlow } from '@/components/EggCodeFlow';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function HidePage() {
  await requirePageSession();
  return (
    <SkyPage>
      <HideEggFlow />
    </SkyPage>
  );
}
