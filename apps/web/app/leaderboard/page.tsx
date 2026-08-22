import { prisma } from '@eggeo/db';
import { appText } from '@eggeo/domain';
import { EggeoText } from '@eggeo/ui';
import { EventFilter } from '@/components/EventFilter';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';
import { getEventLeaderboard } from '@/lib/leaderboard';

const placements = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

type EventOption = {
  id: string;
  title: string;
};

type EventMembership = {
  Event: EventOption;
};

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ eventId?: string }> }) {
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
  const users = selectedEvent ? await getEventLeaderboard(selectedEvent.id) : [];

  return (
    <SkyPage>
      <EggeoText colorized variant="pageTitle">
        LEADERBOARD
      </EggeoText>
      <div className="row" style={{ margin: '0 auto 18px', maxWidth: 520 }}>
        <EventFilter allLabel={appText.events.labels.selectEvent} events={eventOptions} requireSelection webStyle={{ margin: 0, width: '100%' }} />
      </div>
      <section className="stack">
        {users.map((user, index) => (
          <article className="leader-card row" key={`${user.name}-${index}`}>
            <strong>{placements[index] || `${index + 1}th`}</strong>
            <strong>{user.name}</strong>
            <span>{Math.abs(user.points) === 1 ? `${user.points}pt.` : `${user.points}pts.`}</span>
          </article>
        ))}
        {users.length === 0 && (
          <article className="leader-card">
            <EggeoText>{selectedEvent ? appText.score.messages.noScores : appText.score.messages.selectEventForRanking}</EggeoText>
          </article>
        )}
      </section>
    </SkyPage>
  );
}
