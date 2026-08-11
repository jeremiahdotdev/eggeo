import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await requireSession();
    const data = await prisma.userEgg.findMany({
      where: {
        username: session.username,
      },
      select: {
        Egg: {
          select: {
            points: true,
          },
        },
      },
    });

    return ok({ points: data.map((entry) => entry.Egg.points ?? 1).reduce((a, b) => a + b, 0) });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE() {
  try {
    const session = await requireSession();
    await prisma.userEgg.deleteMany({
      where: {
        username: session.username,
      },
    });

    return ok({ points: 0 });
  } catch (error) {
    return apiError(error);
  }
}
