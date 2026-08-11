import { prisma } from '@eggeo/db';
import { requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const { coords, id, username } = await readBody(event);

    const newLocation = await prisma.location.upsert({
      where: {
        eggId: id,
      },
      create: {
        eggId: id,
        ...coords,
      },
      update: {
        eggId: id,
        ...coords,
      },
    });

    const currentEgg = await prisma.egg.update({
      where: {
        id: id,
      },
      data: {
        username: username,
      },
    });

    return newLocation;
  }),
);
