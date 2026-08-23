import { z } from 'zod';
import { prisma } from '@eggeo/db';
import { apiError, badRequest, ok } from '@/lib/api';
import { sumEggPoints } from '@/lib/egg';
import { requireSession } from '@/lib/session';

const scoreQuerySchema = z.object({
  eventId: z.string().uuid().optional(),
});

function getScoreQuery(request: Request) {
  const url = new URL(request.url);

  return scoreQuerySchema.parse({
    eventId: url.searchParams.get('eventId') || undefined,
  });
}

async function isEventMember(username: string, eventId: string) {
  const membership = await prisma.userEvent.findUnique({
    where: {
      username_eventId: {
        eventId,
        username,
      },
    },
  });

  return Boolean(membership);
}

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const { eventId } = getScoreQuery(request);

    if (eventId && !(await isEventMember(session.username, eventId))) {
      return ok({ points: 0 });
    }

    const data = await prisma.userEgg.findMany({
      where: {
        ...(eventId ? { Egg: { eventId } } : {}),
        username: session.username,
      },
      select: {
        Egg: {
          select: {
            points: true,
          },
        },
      },
    });

    return ok({ points: sumEggPoints(data) });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireSession();
    const { eventId } = getScoreQuery(request);

    if (!eventId) {
      return badRequest('Select an event to reset score.');
    }

    if (!(await isEventMember(session.username, eventId))) {
      return ok({ points: 0 });
    }

    await prisma.userEgg.deleteMany({
      where: {
        Egg: {
          eventId,
        },
        username: session.username,
      },
    });

    return ok({ points: 0 });
  } catch (error) {
    return apiError(error);
  }
}
