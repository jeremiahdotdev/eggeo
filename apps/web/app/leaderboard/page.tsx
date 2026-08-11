import { prisma } from '@eggeo/db';
import { PageTitle } from '@/components/PageTitle';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';
import { displayName } from '@/lib/egg';

const placements = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

export default async function LeaderboardPage() {
  await requirePageSession();
  const data = await prisma.userEgg.findMany({
    select: {
      User: true,
      Egg: {
        select: {
          points: true,
        },
      },
    },
  });
  const grouped = new Map<string, { name: string; points: number }>();

  for (const entry of data) {
    const name = displayName(entry.User.name);
    const existing = grouped.get(name);
    grouped.set(name, {
      name,
      points: (existing?.points ?? 0) + (entry.Egg.points ?? 1),
    });
  }

  const users = [...grouped.values()].sort((a, b) => b.points - a.points);

  return (
    <SkyPage>
      <PageTitle>LEADERBOARD</PageTitle>
      <section className="stack">
        {users.map((user, index) => (
          <article className="leader-card row" key={user.name}>
            <strong>{placements[index] || `${index + 1}th`}</strong>
            <strong>{user.name}</strong>
            <span>{Math.abs(user.points) === 1 ? `${user.points}pt.` : `${user.points}pts.`}</span>
          </article>
        ))}
      </section>
    </SkyPage>
  );
}
