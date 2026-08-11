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
      const egg = await prisma.egg.update({
        where: {
          id: id,
        },
        data: {
          isCollected: true,
        },
      });
      response.push(egg);
    } catch (deleteError: any) {
      console.error(deleteError);
    }

    return response;
  }),
);
