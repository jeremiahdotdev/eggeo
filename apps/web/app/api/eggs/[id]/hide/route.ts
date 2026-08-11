import { z } from 'zod';
import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

const hideEggSchema = z.object({
  coords: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const { coords } = hideEggSchema.parse(await request.json());

    const location = await prisma.location.upsert({
      where: {
        eggId: id,
      },
      create: {
        eggId: id,
        lat: coords.lat,
        lng: coords.lng,
      },
      update: {
        lat: coords.lat,
        lng: coords.lng,
      },
    });

    await prisma.egg.update({
      where: {
        id,
      },
      data: {
        username: session.username,
        isCollected: false,
      },
    });

    return ok(location);
  } catch (error) {
    return apiError(error);
  }
}
