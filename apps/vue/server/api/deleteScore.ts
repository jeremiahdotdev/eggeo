import { prisma } from '@eggeo/db';
import { getUser, requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const username = await getUser(event);
    if (!username) return false;

    const response = [];
    try {
      const userEgg = await prisma.userEgg.deleteMany({
        where: {
          username: username,
        },
      });
      response.push(userEgg);
    } catch (deleteError: any) {
      console.error(deleteError);
    }
    return response;
  }),
);
