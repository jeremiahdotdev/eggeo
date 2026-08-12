import { z } from 'zod';
import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

const createEventSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
});

export async function GET() {
  try {
    const session = await requireSession();
    const memberships = await prisma.userEvent.findMany({
      where: {
        username: session.username,
      },
      include: {
        Event: {
          include: {
            _count: {
              select: {
                eggs: true,
              },
            },
          },
        },
      },
    });

    return ok(
      memberships
        .map(({ Event }) => ({
          description: Event.description,
          eggCount: Event._count.eggs,
          id: Event.id,
          isOwner: Event.username === session.username,
          title: Event.title,
          username: Event.username,
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    );
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const input = createEventSchema.parse(await request.json());
    const event = await prisma.event.create({
      data: {
        description: input.description,
        title: input.title,
        username: session.username,
        members: {
          create: {
            username: session.username,
          },
        },
      },
      include: {
        _count: {
          select: {
            eggs: true,
          },
        },
      },
    });

    return ok({
      description: event.description,
      eggCount: event._count.eggs,
      id: event.id,
      isOwner: true,
      title: event.title,
      username: event.username,
    });
  } catch (error) {
    return apiError(error);
  }
}
