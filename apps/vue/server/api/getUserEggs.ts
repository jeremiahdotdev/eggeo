import { prisma } from '@eggeo/db';
import { getUser, requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const username = await getUser(event);
    try {
      return await prisma.egg.findMany({
        where: {
          username: username,
          isCollected: false,
        },
        include: {
          coords: {},
        },
      });
    } catch (error: unknown) {
      console.error(error);
    }
  }),
);
