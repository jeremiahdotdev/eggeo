import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
      },
    });

    if (event?.username !== session.username) {
      return ok({ deleted: false });
    }

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return ok({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
