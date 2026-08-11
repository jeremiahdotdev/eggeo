import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
    const { id } = await params;

    await prisma.location.deleteMany({
      where: {
        eggId: id,
      },
    });
    const egg = await prisma.egg.update({
      where: {
        id,
      },
      data: {
        isCollected: true,
      },
    });

    return ok(egg);
  } catch (error) {
    return apiError(error);
  }
}
