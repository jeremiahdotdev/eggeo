import { prisma } from '@eggeo/db';
import { getUser, requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const username = await getUser(event);
    const { count, title, description, color, points } = await readBody(event);
    const config = useRuntimeConfig();
    let eggCount;

    try {
      const data = await prisma.egg.aggregate({
        where: {
          username: username,
        },
        _count: {
          id: true,
        },
      });
      eggCount = data._count.id;
    } catch (e: unknown) {
      console.error(e);
    }

    if (count >= config.public.maxEggsPerUser) return { status: 'MAX_EGGS_REACHED' };

    try {
      let i;
      for (i = 0; i < count; i++) {
        await prisma.egg.create({
          data: {
            title: count === 1 ? title : `${title} #${i + 1}`,
            description: description,
            username: username,
            color: color,
            points: points,
          },
        });
      }
      return i;
    } catch (e: unknown) {
      console.error(e);
    }
  }),
);
