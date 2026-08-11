import { prisma } from '@eggeo/db';
import { requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const { id } = await readBody(event);
    const response = [];
    try {
      const location = await prisma.location.delete({
        where: {
          eggId: id,
        },
      });
      response.push(location);
    } catch (locationError: any) {
      console.error(locationError);
    }

    try {
      const userEgg = await prisma.userEgg.deleteMany({
        where: {
          eggId: id,
        },
      });
      response.push(userEgg);
    } catch (deleteError: any) {
      console.error(deleteError);
    }

    try {
      const egg = await prisma.egg.delete({
        where: {
          id: id,
        },
      });
      response.push(egg);
    } catch (deleteError: any) {
      console.error(deleteError);
    }

    return response;
  }),
);
