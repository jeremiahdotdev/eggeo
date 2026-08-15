import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { sumEggPoints } from '@/lib/egg';
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

    return ok({ points: sumEggPoints(data) });
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
