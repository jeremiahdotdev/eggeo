import { NearbyEggs } from '@/components/NearbyEggs';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyScene } from '@/components/SkyScene';

export default async function LocatorPage() {
  await requirePageSession();
  const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? process.env.NUXT_PUBLIC_MAPS_API_KEY ?? '';

  return (
    <SkyScene className="locator-scene" showHill={false}>
      <NearbyEggs mapsApiKey={mapsApiKey} />
    </SkyScene>
  );
}
