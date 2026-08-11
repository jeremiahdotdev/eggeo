import { FindEggFlow } from '@/components/EggCodeFlow';
import { requirePageSession } from '@/components/RequireAuth';

export default async function FindPage() {
  await requirePageSession();
  return <FindEggFlow />;
}
