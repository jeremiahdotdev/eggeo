import { prisma } from '@eggeo/db';
import { displayName } from '@/lib/egg';

export type LeaderboardEntry = {
  name: string;
  points: number;
};

export async function getEventLeaderboard(eventId: string): Promise<LeaderboardEntry[]> {
  const data = await prisma.userEgg.findMany({
    where: {
      Egg: {
        eventId,
      },
    },
    select: {
      username: true,
      User: {
        select: {
          name: true,
        },
      },
      Egg: {
        select: {
          points: true,
        },
      },
    },
  });

  const grouped = new Map<string, LeaderboardEntry>();

  for (const entry of data) {
    const existing = grouped.get(entry.username);
    grouped.set(entry.username, {
      name: existing?.name ?? displayName(entry.User.name),
      points: (existing?.points ?? 0) + (entry.Egg.points ?? 1),
    });
  }

  return [...grouped.values()].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}
