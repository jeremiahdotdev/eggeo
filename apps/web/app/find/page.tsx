import { FindEggFlow } from '@/components/EggCodeFlow';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function FindPage() {
  await requirePageSession();
  return (
    <SkyPage>
      <FindEggFlow />
    </SkyPage>
  );
}
