import { redirect } from 'next/navigation';
import { prisma } from '@eggeo/db';
import { requirePageSession } from '@/components/RequireAuth';

export default async function EventJoinPage({ params }: { params: Promise<{ uuid: string }> }) {
  const session = await requirePageSession();
  const { uuid } = await params;
  const event = await prisma.event.findUnique({
    where: {
      id: uuid,
    },
  });

  if (event) {
    await prisma.userEvent.upsert({
      where: {
        username_eventId: {
          eventId: uuid,
          username: session.username,
        },
      },
      create: {
        eventId: uuid,
        username: session.username,
      },
      update: {},
    });
  }

  redirect(event ? `/locator?eventId=${event.id}` : '/find');
}
