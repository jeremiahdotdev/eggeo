import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { clearSession, requireSession } from '@/lib/session';

export async function DELETE() {
  try {
    const session = await requireSession();
    const username = session.username;

    await prisma.$transaction(async (tx) => {
      const ownedEggs = await tx.egg.findMany({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });
      const ownedEggIds = ownedEggs.map((egg) => egg.id);

      if (ownedEggIds.length > 0) {
        await tx.location.deleteMany({
          where: {
            eggId: {
              in: ownedEggIds,
            },
          },
        });
        await tx.userEgg.deleteMany({
          where: {
            eggId: {
              in: ownedEggIds,
            },
          },
        });
      }

      await tx.userEgg.deleteMany({
        where: {
          username,
        },
      });
      await tx.egg.deleteMany({
        where: {
          username,
        },
      });
      await tx.userEvent.deleteMany({
        where: {
          username,
        },
      });
      await tx.event.deleteMany({
        where: {
          username,
        },
      });
      await tx.user.delete({
        where: {
          username,
        },
      });
    });

    await clearSession();

    return ok({ status: 'ok' });
  } catch (error) {
    return apiError(error);
  }
}
