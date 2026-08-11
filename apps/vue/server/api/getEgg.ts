import { prisma } from '@eggeo/db';
import { getUser, requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const egg = await readBody(event);
    try {
      return await prisma.egg.findUnique({
        where: {
          id: egg.id,
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
