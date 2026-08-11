import { z } from 'zod';
import { prisma } from '@eggeo/db';
import { apiError, badRequest, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

const createEggSchema = z.object({
  count: z.coerce.number().int().min(1).max(200).default(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  color: z.string().trim().optional(),
  points: z.coerce.number().int().default(1),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const input = createEggSchema.parse(await request.json());
    const maxEggsPerUser = Number.parseInt(process.env.NEXT_PUBLIC_MAX_EGGS_PER_USER ?? process.env.NUXT_PUBLIC_MAX_EGGS_PER_USER ?? '200', 10);
    const existingCount = await prisma.egg.count({
      where: {
        username: session.username,
        isCollected: false,
      },
    });

    if (existingCount + input.count > maxEggsPerUser) {
      return badRequest('MAX_EGGS_REACHED');
    }

    for (let i = 0; i < input.count; i += 1) {
      await prisma.egg.create({
        data: {
          title: input.count === 1 ? input.title : `${input.title} #${i + 1}`,
          description: input.description,
          username: session.username,
          color: input.color,
          points: input.points,
        },
      });
    }

    return ok({ created: input.count });
  } catch (error) {
    return apiError(error);
  }
}
