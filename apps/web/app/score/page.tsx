import { prisma } from '@eggeo/db';
import { appText } from '@eggeo/domain';
import { EggeoText } from '@eggeo/ui';
import { EventFilter } from '@/components/EventFilter';
import { requirePageSession } from '@/components/RequireAuth';
import { ScoreReset } from '@/components/ScoreReset';
import { SkyScene } from '@/components/SkyScene';
import { sumEggPoints } from '@/lib/egg';

type EventOption = {
  id: string;
  title: string;
};

type EventMembership = {
  Event: EventOption;
};

export default async function ScorePage({ searchParams }: { searchParams: Promise<{ eventId?: string }> }) {
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
  const eventOptions = events.map(({ Event }: EventMembership) => Event).sort((a: EventOption, b: EventOption) => a.title.localeCompare(b.title));
  const selectedEvent = eventOptions.find((event) => event.id === eventId);
  const data = selectedEvent
    ? await prisma.userEgg.findMany({
        where: {
          Egg: {
            eventId: selectedEvent.id,
          },
          username: session.username,
        },
        select: {
          Egg: {
            select: {
              points: true,
            },
          },
        },
      })
    : [];
  const points = sumEggPoints(data);

  return (
    <SkyScene className="hero">
      <section className="stack" style={{ width: 'min(720px, 100%)' }}>
        <EggeoText colorized variant="pageTitle">
          {appText.nav.score}
        </EggeoText>
        <EventFilter allLabel={appText.events.labels.selectEvent} events={eventOptions} requireSelection webStyle={{ margin: 0, width: '100%' }} />
        <ScoreReset eventId={selectedEvent?.id ?? ''} initialPoints={points} />
      </section>
    </SkyScene>
  );
}
