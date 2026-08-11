import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await requireSession();
    const eggs = await prisma.egg.findMany({
      where: {
        username: session.username,
        isCollected: false,
      },
      include: {
        coords: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    return ok(eggs);
  } catch (error) {
    return apiError(error);
  }
}
