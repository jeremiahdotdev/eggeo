import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId') || undefined;

    if (eventId) {
      const event = await prisma.event.findFirst({
        where: {
          id: eventId,
          username: session.username,
        },
      });

      if (!event) {
        return ok([]);
      }
    }

    const eggs = await prisma.egg.findMany({
      where: {
        eventId,
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
