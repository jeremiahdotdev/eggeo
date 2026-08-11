import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
    const { id } = await params;
    const egg = await prisma.egg.findUnique({
      where: {
        id,
      },
      include: {
        coords: true,
      },
    });

    return ok(egg);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const egg = await prisma.egg.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
      },
    });

    if (egg?.username !== session.username) {
      return ok({ deleted: false });
    }

    await prisma.location.deleteMany({
      where: {
        eggId: id,
      },
    });
    await prisma.userEgg.deleteMany({
      where: {
        eggId: id,
      },
    });
    await prisma.egg.delete({
      where: {
        id,
      },
    });

    return ok({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
