import { prisma } from '@eggeo/db';
import { NearbyEggs } from '@/components/NearbyEggs';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyScene } from '@/components/SkyScene';

type EventOption = {
  id: string;
  title: string;
};

type EventMembership = {
  Event: EventOption;
};

export default async function LocatorPage({ searchParams }: { searchParams: Promise<{ eventId?: string }> }) {
  const session = await requirePageSession();
  const { eventId = '' } = await searchParams;
  const events = await prisma.userEvent.findMany({
    where: {
      username: session.username,
    },
    include: {
      Event: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? '';
  const eventOptions = events.map(({ Event }: EventMembership) => Event).sort((a: EventOption, b: EventOption) => a.title.localeCompare(b.title));

  return (
    <SkyScene className="locator-scene" showHill={false}>
      <NearbyEggs events={eventOptions} initialEventId={eventId} mapsApiKey={mapsApiKey} />
    </SkyScene>
  );
}
