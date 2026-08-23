import type { ApiEvent } from '@eggeo/api-client';
import { prisma } from '@eggeo/db';

type EventMembership = {
  Event: {
    _count: {
      eggs: number;
    };
    description: string | null;
    id: string;
    title: string;
    username: string;
  };
};

export async function getEventsForUser(username: string): Promise<ApiEvent[]> {
  const memberships = await prisma.userEvent.findMany({
    where: {
      username,
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

  return memberships
    .map(({ Event }: EventMembership): ApiEvent => ({
      description: Event.description,
      eggCount: Event._count.eggs,
      id: Event.id,
      isOwner: Event.username === username,
      title: Event.title,
      username: Event.username,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
