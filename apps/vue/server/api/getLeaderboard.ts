import { prisma } from '@eggeo/db';
import { requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    try {
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

      const namesAndPoints = data
        .map((datum) => ({
          name: datum.User.name ?? '',
          points: datum.Egg.points ?? 1,
        }))
        .sort((a, b) => b.points - a.points);

      const groupedItems = namesAndPoints.reduce((acc: any, currentItem: any) => {
        const { name, points } = currentItem;
        if (!acc[name]) {
          acc[name] = { name, points: points };
        } else {
          acc[name].points += points;
        }
        return acc;
      }, {});

      return Object.values(groupedItems).sort((a: any, b: any) => b.points - a.points);
    } catch (error: unknown) {
      console.error(error);
    }
  }),
);
