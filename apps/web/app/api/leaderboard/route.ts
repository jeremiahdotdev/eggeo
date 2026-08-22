import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { getEventLeaderboard } from '@/lib/leaderboard';
import { requireSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId') || undefined;

    if (!eventId) {
      return ok([]);
    }

    const membership = await prisma.userEvent.findUnique({
      where: {
        username_eventId: {
          eventId,
          username: session.username,
        },
      },
    });

    if (!membership) {
      return ok([]);
    }

    return ok(await getEventLeaderboard(eventId));
  } catch (error) {
    return apiError(error);
  }
}
