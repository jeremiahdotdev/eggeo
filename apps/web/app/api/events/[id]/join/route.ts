import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            eggs: true,
          },
        },
      },
    });

    if (!event) {
      throw new Response(JSON.stringify({ message: 'Event not found.' }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
        },
      });
    }

    await prisma.userEvent.upsert({
      where: {
        username_eventId: {
          eventId: id,
          username: session.username,
        },
      },
      create: {
        eventId: id,
        username: session.username,
      },
      update: {},
    });

    return ok({
      description: event.description,
      eggCount: event._count.eggs,
      id: event.id,
      isOwner: event.username === session.username,
      title: event.title,
      username: event.username,
    });
  } catch (error) {
    return apiError(error);
  }
}
