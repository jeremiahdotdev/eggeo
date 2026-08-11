import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { displayName } from '@/lib/egg';
import { requireSession } from '@/lib/session';

export async function GET() {
  try {
    await requireSession();
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

    return ok([...grouped.values()].sort((a, b) => b.points - a.points));
  } catch (error) {
    return apiError(error);
  }
}
