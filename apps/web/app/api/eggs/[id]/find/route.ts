import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const foundEgg = await prisma.userEgg.upsert({
      where: {
        id: {
          username: session.username,
          eggId: id,
        },
      },
      create: {
        username: session.username,
        eggId: id,
      },
      update: {
        username: session.username,
        eggId: id,
      },
      include: {
        Egg: true,
      },
    });

    return ok(foundEgg);
  } catch (error) {
    return apiError(error);
  }
}
